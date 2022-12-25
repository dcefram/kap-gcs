const kapPluginTest = require("kap-plugin-test");
const { Storage } = require("@google-cloud/storage");

jest.mock("@google-cloud/storage");

describe("kap-gcp", () => {
  const mockPublicUrl = "mock-public-url";
  let uploadFn = jest.fn(() =>
    Promise.resolve([{ publicUrl: jest.fn(() => mockPublicUrl) }])
  );

  beforeAll(() => {
    Storage.mockImplementation(() => ({
      bucket: jest.fn(() => ({
        upload: uploadFn,
      })),
    }));
  });

  it("main", async () => {
    const plugin = kapPluginTest("unicorn.gif");
    plugin.context.copyToClipboard = jest.fn();

    await plugin.run();

    expect(uploadFn).toBeCalledWith("unicorn.gif", { public: true });

    expect(plugin.context.copyToClipboard).toBeCalledWith(mockPublicUrl);
  });
});
