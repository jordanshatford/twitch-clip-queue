import { defineStore } from "pinia"
import { ClipList } from "@/utils/clip-list"
import type { Clip } from "@/interfaces/clips"
import { useSettings } from "@/stores/settings"
import { useUser } from "@/stores/user"
import { useModeration } from "@/stores/moderation"
import { formatTemplateString, deepEqual } from "@/utils"

export interface QueueSettings {
  isLimited: boolean
  limit: number | null
}

export const DEFAULT_SETTINGS: QueueSettings = {
  isLimited: false,
  limit: null,
}

export interface ClipQueue {
  isOpen: boolean
  history: ClipList
  current: Clip | undefined
  upcoming: ClipList
  settings: QueueSettings
}

export const useQueue = defineStore("queue", {
  persist: {
    key: "queue",
    paths: ["history", "upcoming", "settings"],
  },
  state: (): ClipQueue => ({
    isOpen: true,
    history: new ClipList(),
    current: undefined,
    upcoming: new ClipList(),
    settings: { ...DEFAULT_SETTINGS },
  }),
  getters: {
    isSettingsModified: (state) => {
      return (settings: QueueSettings) => {
        return !deepEqual(state.settings, settings)
      }
    },
  },
  actions: {
    clear() {
      this.upcoming = new ClipList()
    },
    purge() {
      this.history = new ClipList()
    },
    add(clip: Clip, force = false) {
      // Ignore clip when queue isnt open
      if (!this.open && !force) {
        return
      }
      // Ignore when we have previously watched it
      const hasBeenWatched = this.current?.id === clip.id || this.history.includes(clip)
      if (hasBeenWatched) {
        return
      }
      // Clip not allowed
      const moderation = useModeration()
      if (!moderation.isAllowed(clip)) {
        return
      }
      // Queue is full based on limit
      if (this.settings.isLimited && this.settings.limit && this.upcoming.size() >= this.settings.limit) {
        // If the clip is already in the queue add it so submitters is updated
        if (!this.upcoming.includes(clip)) {
          return
        }
      }
      this.upcoming.add(clip)
    },
    remove(clip: Clip) {
      this.upcoming.remove(clip)
    },
    removeSubmitterClips(submitter: string) {
      this.upcoming.removeBySubmitter(submitter)
    },
    play(clip: Clip) {
      if (!this.upcoming.includes(clip)) {
        return
      }
      if (this.current?.id) {
        this.history.add(this.current)
      }
      this.upcoming.remove(clip)
      this.current = clip
      this.sendCurrentClipInfoMessageIfNeeded()
    },
    open() {
      const settings = useSettings()
      /* istanbul ignore next */
      if (settings.sendQueueOpenMsg) {
        const user = useUser()
        user.chat?.sendMessage(settings.queueOpenMsg)
      }
      this.isOpen = true
    },
    close() {
      const settings = useSettings()
      /* istanbul ignore next */
      if (settings.sendQueueCloseMsg) {
        const user = useUser()
        user.chat?.sendMessage(settings.queueCloseMsg)
      }
      this.isOpen = false
    },
    previous() {
      if (this.current?.id) {
        this.upcoming.unshift(this.current)
      }
      this.current = this.history.pop()
    },
    next() {
      if (this.current?.id) {
        this.history.add(this.current)
      }
      this.current = this.upcoming.shift()
      this.sendCurrentClipInfoMessageIfNeeded()
    },
    sendCurrentClipInfoMessageIfNeeded() {
      const settings = useSettings()
      if (this.current?.id && settings.sendMsgsInChat && settings.sendCurrentClipMsg) {
        const valueMappings = {
          title: this.current?.title ?? "",
          url: this.current?.url ?? "",
          channel: this.current?.channel ?? "",
          game: this.current?.game ?? "",
          submitter: this.current?.submitter ?? "",
        }
        const user = useUser()
        user.chat?.sendMessage(formatTemplateString(settings.currentClipMsg, valueMappings))
      }
    },
    updateSettings(settings: QueueSettings) {
      this.settings = settings
    },
  },
})
