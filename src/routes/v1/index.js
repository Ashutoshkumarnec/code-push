const express = require("express");
const bundleRoute = require("./bundle.route");
const report = require("./report.route");
const adoptionRate = require("./adoption.route");
const userRoute = require("./user.routes");
const orgRoute = require("./org.route");
const deploymentRoutes = require("./deployment.route")
const authRoutes = require("./auth.route")

const router = express.Router();

const defaultRoutes = [
  {
    path: "/bundle",
    route: bundleRoute
  },
  {
    path: "/clients",
    route: report
  },
  {
    path: "/analytics",
    route: adoptionRate
  },
  {
    path: "/users",
    route: userRoute
  },
  {
    path: "/orgs",
    route: orgRoute
  },
  {
    path: "/deployments",
    route: deploymentRoutes
  },
  {
    path: '/auth',
    route: authRoutes
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
