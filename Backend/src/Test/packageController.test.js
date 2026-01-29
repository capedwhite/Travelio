
import  { createPackage, deletePackage, getactivePackage, getPackageByid, updatePackage } from "../Controller/packageController.js"
import { Package } from "../Model/packageModel.js"
jest.mock("../Model/packageModel",()=>({
    createPackage:jest.fn(),
    getPackage:jest.fn(),
    getactivePackage:jest.fn(),
    deletePackage:jest.fn(),
    updatePackage:jest.fn(),
    getPackageByid:jest.fn(),

}))
describe("package Controller",()=>{
    const mockResponse = ()=>{
        const res = {};
        res.status=jest.fn().mockReturnValue(res);
        res.json=jest.fn().mockReturnValue(res);
        return res;
    };
    it("should create a package",async()=>{
        const req={body: { productName: "Test Package", price: 100 }};
        const res=mockResponse();
        Package.create.mockResolvedValue({id:1, ...req.body});
        await createPackage(req,res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({id:1, productName:"Test Package", price:100}));
    })
    it("should get active packages",async()=>{
        const req={};
        const res=mockResponse();
        const mockPackages=[{id:1, productName:"Package 1"},{id:2, productName:"Package 2"}];
        Package.getactivePackage.mockResolvedValue(mockPackages);  
        await getactivePackage(req,res);})
        it("should get package by id",async()=>{   
            const req={params:{id:1}};
            const res=mockResponse();
            const mockPackage={id:1, productName:"Package 1"};
            Package.getPackageByid.mockResolvedValue(mockPackage);
            await getPackageByid(req,res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockPackage);
        })
        it( "should update a package",async()=>{
            const req={params:{id:1}, body:{productName:"Updated Package"}};
            const res=mockResponse();
            const mockUpdatedPackage={id:1, productName:"Updated Package"};
            Package.updatePackage.mockResolvedValue([1,mockUpdatedPackage]);
            await updatePackage(req,res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({message:"Package updated successfully"}));
        })
        it("should delete a package",async()=>{
            const req={params:{id:1}};
            const res=mockResponse();
            Package.deletePackage.mockResolvedValue(1);
            await deletePackage(req,res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({message:"Package deleted successfully"}));
        })

})