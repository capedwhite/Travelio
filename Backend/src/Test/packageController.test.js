import { jest } from "@jest/globals";

// Mock the Package model
const mockPackage = {
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  findOne: jest.fn(),
};

jest.unstable_mockModule("../Model/packageModel.js", () => ({
  Package: mockPackage,
}));

// Import controller after mocking
const {
  createPackage,
  deletePackage,
  getactivePackage,
  getPackageByid,
  updatePackage,
  getPackage,
} = await import("../Controller/packageController.js");

describe("Package Controller", () => {
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getPackage", () => {
    it("should get all packages", async () => {
      const req = {};
      const res = mockResponse();
      const mockPackages = [
        { id: 1, title: "Package 1" },
        { id: 2, title: "Package 2" },
      ];
      mockPackage.findAll.mockResolvedValue(mockPackages);

      await getPackage(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        data: mockPackages,
        message: "sucessfully fetched all packages",
      });
    });

    it("should handle errors when getting packages", async () => {
      const req = {};
      const res = mockResponse();
      mockPackage.findAll.mockRejectedValue(new Error("Database error"));

      await getPackage(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getactivePackage", () => {
    it("should get active packages", async () => {
      const req = { user: { id: 1 }, query: {} };
      const res = mockResponse();
      const mockPackages = [
        { id: 1, title: "Package 1", status: "Active" },
        { id: 2, title: "Package 2", status: "Active" },
      ];
      mockPackage.findAll.mockResolvedValue(mockPackages);

      await getactivePackage(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        data: mockPackages,
        message: "successfully fetched all packages",
      });
    });

    it("should handle errors when getting active packages", async () => {
      const req = { user: { id: 1 }, query: {} };
      const res = mockResponse();
      mockPackage.findAll.mockRejectedValue(new Error("Database error"));

      await getactivePackage(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getPackageByid", () => {
    it("should get package by id", async () => {
      const req = { params: { id: 1 } };
      const res = mockResponse();
      const mockPkg = { id: 1, title: "Package 1" };
      mockPackage.findOne.mockResolvedValue(mockPkg);

      await getPackageByid(req, res);

      expect(mockPackage.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        data: mockPkg,
        message: "fetched package by id sucessfully",
      });
    });

    it("should return 200 even if package is null (current behavior)", async () => {
      const req = { params: { id: 999 } };
      const res = mockResponse();
      mockPackage.findOne.mockResolvedValue(null);

      await getPackageByid(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("deletePackage", () => {
    it("should delete a package (set to inactive)", async () => {
      const req = { params: { id: 1 } };
      const res = mockResponse();
      const mockPkg = {
        id: 1,
        status: "Active",
        save: jest.fn().mockResolvedValue(true),
      };
      mockPackage.findByPk.mockResolvedValue(mockPkg);

      await deletePackage(req, res);

      expect(mockPkg.status).toBe("Inactive");
      expect(mockPkg.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        message: "Package deleted successfully",
      });
    });

    it("should return 404 if package not found", async () => {
      const req = { params: { id: 999 } };
      const res = mockResponse();
      mockPackage.findByPk.mockResolvedValue(null);

      await deletePackage(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 400 if package already inactive", async () => {
      const req = { params: { id: 1 } };
      const res = mockResponse();
      const mockPkg = { id: 1, status: "Inactive" };
      mockPackage.findByPk.mockResolvedValue(mockPkg);

      await deletePackage(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "Package already inactive",
      });
    });
  });
});
