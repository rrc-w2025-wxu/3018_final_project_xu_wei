import { itemsHealthCheck } from "../src/api/v1/controllers/HealthCheck_Controller";
import { Request, Response } from "express";

describe("itemsHealthCheck", () => {
  it("should return status OK and correct fields", () => {
    const req = {} as Request; // handler 不用 req
    const res = {
      json: jest.fn(), // 模拟 res.json
    } as unknown as Response;

    itemsHealthCheck(req, res);

    expect(res.json).toHaveBeenCalledTimes(1);
    const response = (res.json as jest.Mock).mock.calls[0][0];
    expect(response.status).toBe("OK");
    expect(typeof response.uptime).toBe("number");
    expect(typeof response.timestamp).toBe("string");
    expect(response.version).toBe("1.0.0");
  });
});