import { shallowMount } from "@vue/test-utils";
import ClipQueue from "@/components/queue/ClipQueue.vue";

describe("ClipQueue.vue", () => {
  const wrapper = shallowMount(ClipQueue, {
    props: {
      queue: [],
    },
  });

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true);
  });
});
