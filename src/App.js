import { useState, useEffect, useMemo } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import Sidenav from "examples/Sidenav";

// Material Dashboard 2 React themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// Dark mode themes
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// routes
import routes from "routes";

// context
import { useMaterialUIController, setMiniSidenav } from "context";

// images
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";
import brandNews from "assets/images/small-logos/logo-spotify.svg";
import brandTV from "assets/images/tv-logo.svg";
import Cookies from "js-cookie";

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;

  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();

  // RTL cache
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // sidenav hover open
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // sidenav hover close
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // direction attribute
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // scroll to top on route change
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const isAuthenticated = !!Cookies.get("authToken");

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) return getRoutes(route.collapse);

      if (route.route) {
        return (
          <Route
            path={route.route}
            element={
              isAuthenticated || route.key === "login" ? (
                route.component
              ) : (
                <Navigate to="/login" />
              )
            }
            key={route.key}
          />
        );
      }

      return null;
    });

  const location = useLocation();

  const shouldShowSidebar = location.pathname !== "/login";

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
        <CssBaseline />
        {layout === "dashboard" && shouldShowSidebar && (
          <Sidenav
            color={sidenavColor}
            brand={null}
            brandName="Indoz TV"
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
        )}
        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/live-stream" : "/login"} />} />
        </Routes>
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {layout === "dashboard" && shouldShowSidebar && (
        <Sidenav
          color={sidenavColor}
          brand={null}
          brandName="Indoz TV"
          routes={routes}
          onMouseEnter={handleOnMouseEnter}
          onMouseLeave={handleOnMouseLeave}
        />
      )}
      <Routes>
        {getRoutes(routes)}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/live-stream" : "/login"} />} />
      </Routes>
    </ThemeProvider>
  );
}
