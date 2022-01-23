import { shallowMount } from "@vue/test-utils";
import ClipQueueItem from "@/components/queue/ClipQueueItem.vue";
import { Clip } from "@/interfaces/clips";

describe("ClipQueueItem.vue", () => {
  const wrapper = shallowMount(ClipQueueItem, {
    props: {
      clip: {
        id: "test",
        title: "Test title",
        channel: "testchannel",
        game: "testgame",
        timestamp: new Date("December 17, 1995 03:24:00").toDateString(),
        url: "https://www.twitch.tv/test",
        thumbnailUrl: "test",
      } as Clip,
    },
  });

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true);
  });
});
