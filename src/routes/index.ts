'use strict';
import  {Router} from 'express';
const router = Router();


// import routes
import userRoute from "./user.route";
import authRoute from "./auth.route";
import technicianRoute from "./technician.route";
import departmentRoute from "./department.route";
import catalogRoute from "./catalog.route";
import inventoryRoute from "./inventory.route";
import systemRoute from "./system.route";

// route use
router.use('/auth',authRoute);
router.use('/users',userRoute);
router.use('/technicians',technicianRoute);
router.use('/departments',departmentRoute);
router.use('/catalog',catalogRoute);
router.use('/inventory',inventoryRoute);
router.use('/system',systemRoute);


export default router;
