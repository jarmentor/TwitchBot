import React, { useState, useMemo, useEffect, useContext } from "react";
import { useMediaQuery } from "@mui/material";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import PropTypes from "prop-types";

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

const getInitialMode = (prefersDarkMode) => {
  const storedMode = localStorage.getItem("mode");
  if (storedMode) {
    return storedMode;
  }
  return prefersDarkMode ? "dark" : "light";
};

const ThemeProvider = ({ children }) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState(() => getInitialMode(prefersDarkMode));

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === "light" ? "dark" : "light";
          return newMode;
        });
      },
    }),
    []
  );

  useEffect(() => {
    localStorage.setItem("mode", mode);
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ThemeProvider;

export { ColorModeContext };

export const useColorMode = () => useContext(ColorModeContext);
