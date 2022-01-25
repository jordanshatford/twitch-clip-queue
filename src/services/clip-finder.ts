import config from "@/assets/config";
import { Clip } from "@/interfaces/clips";
import TwitchAPI from "@/services/twitch-api";
import { getIdFromUrl } from "@/utils/url";

const { hostnames } = config.Twitch.Clips;

export default class ClipFinder {
  public static async getTwitchClip(url: string): Promise<Clip | undefined> {
    if (!this.isTwitchClip(url)) {
      return;
    }

    const id = getIdFromUrl(url);
    const clipInfo = await TwitchAPI.getClip(id);

    if (clipInfo) {
      const game = await TwitchAPI.getGame(clipInfo.game_id);
      return {
        id,
        title: clipInfo.title,
        channel: clipInfo.broadcaster_name,
        game: game.name,
        timestamp: clipInfo.created_at,
        url: clipInfo.url,
        thumbnailUrl: clipInfo.thumbnail_url,
      };
    }
  }

  private static isTwitchClip(url: string): boolean {
    try {
      const uri = new URL(url);
      return hostnames.includes(uri.hostname);
    } catch {
      return false;
    }
  }
}
