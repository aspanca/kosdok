import { Router } from "express";
import * as adminDataController from "./admin.data.controller";

export const adminDataRouter = Router();

// Cities CRUD
adminDataRouter.get("/cities", adminDataController.listCities);
adminDataRouter.post("/cities", adminDataController.createCity);
adminDataRouter.patch("/cities/:id", adminDataController.updateCity);
adminDataRouter.delete("/cities/:id", adminDataController.deleteCity);

// Services CRUD
adminDataRouter.get("/services", adminDataController.listServices);
adminDataRouter.post("/services", adminDataController.createService);
adminDataRouter.patch("/services/:id", adminDataController.updateService);
adminDataRouter.delete("/services/:id", adminDataController.deleteService);

// Facilities CRUD
adminDataRouter.get("/facilities", adminDataController.listFacilities);
adminDataRouter.post("/facilities", adminDataController.createFacility);
adminDataRouter.patch("/facilities/:id", adminDataController.updateFacility);
adminDataRouter.delete("/facilities/:id", adminDataController.deleteFacility);

// List entities
adminDataRouter.get("/patients", adminDataController.listPatients);
adminDataRouter.get("/clinics", adminDataController.listClinics);
adminDataRouter.get("/labs", adminDataController.listLabs);
adminDataRouter.get("/pharmacies", adminDataController.listPharmacies);
adminDataRouter.get("/doctors", adminDataController.listDoctors);

// Suspend accounts
adminDataRouter.post("/patients/:id/suspend", adminDataController.suspendPatient);
adminDataRouter.post("/patients/:id/unsuspend", adminDataController.unsuspendPatient);
adminDataRouter.post("/clinics/:id/suspend", adminDataController.suspendClinic);
adminDataRouter.post("/clinics/:id/unsuspend", adminDataController.unsuspendClinic);
adminDataRouter.post("/labs/:id/suspend", adminDataController.suspendLab);
adminDataRouter.post("/labs/:id/unsuspend", adminDataController.unsuspendLab);
adminDataRouter.post("/pharmacies/:id/suspend", adminDataController.suspendPharmacy);
adminDataRouter.post("/pharmacies/:id/unsuspend", adminDataController.unsuspendPharmacy);
adminDataRouter.post("/doctors/:id/suspend", adminDataController.suspendDoctor);
adminDataRouter.post("/doctors/:id/unsuspend", adminDataController.unsuspendDoctor);
