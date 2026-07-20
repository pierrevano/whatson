import { createHashForEmail } from "utils/createHashForEmail";
import { getPreferences } from "utils/getPreferences";
import useFetchWithStatusCode from "utils/useFetchWithStatusCode";

jest.mock("utils/useFetchWithStatusCode");
jest.mock("utils/createHashForEmail");

describe("getPreferences (auth-gated preferences fetch)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useFetchWithStatusCode.mockReturnValue({ data: null, statusCode: 200 });
    createHashForEmail.mockReturnValue("HASH123");
  });

  it("requests the digest-scoped preferences URL when authenticated with an email", () => {
    getPreferences(true, { email: "user@example.com" });

    expect(createHashForEmail).toHaveBeenCalledWith(
      "user@example.com",
      expect.anything(),
    );
    expect(useFetchWithStatusCode).toHaveBeenCalledTimes(1);
    const url = useFetchWithStatusCode.mock.calls[0][0];
    expect(url).toContain("/preferences/user@example.com");
    expect(url).toContain("digest=HASH123");
  });

  it("makes no preferences request when the user is not authenticated", () => {
    getPreferences(false, null);

    expect(useFetchWithStatusCode).toHaveBeenCalledWith(null);
    expect(createHashForEmail).not.toHaveBeenCalled();
  });

  it("makes no preferences request when authenticated but the user has no email", () => {
    getPreferences(true, {});

    expect(useFetchWithStatusCode).toHaveBeenCalledWith(null);
    expect(createHashForEmail).not.toHaveBeenCalled();
  });
});
