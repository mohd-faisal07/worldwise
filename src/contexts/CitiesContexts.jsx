// import { action } from "@remix-run/router";
// import { RuleTester } from "eslint";
import {
  createContext,
  useState,
  useEffect,
  useContext,
  Children,
  useReducer,
} from "react";
// import { act } from "react-dom/test-utils";

const BASE_URL = "http://localhost:9000";

const CitiesContext = createContext();

const intialState = {
  cities: [],
  IsLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        IsLoading: true,
      };

    case "cities/loaded":
      return {
        ...state,
        IsLoading: false,
        cities: action.payload,
      };
    case "city/loaded":
      return {
        ...state,
        IsLoading: false,
        currentCity: action.payload,
      };

    case "city/created":
      return {
        ...state,
        IsLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case "city/deleted":
      return {
        ...state,
        IsLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };

    case "rejected":
      return { ...state, IsLoading: false, error: action.payload };

    default:
      throw new Error("unknown action error 111");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, IsLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    intialState
  );

  // const [cities, setCities] = useState([]);
  // const [IsLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();

        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "there is a problem loading cities",
        });
      }
    }
    fetchCities();
  }, []);
  async function getCity(id) {
    if (Number(id) === currentCity.id) return;
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();

      dispatch({ type: "city/loaded", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "there is a problem loading cities",
      });
    }
  }

  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "content-type": "application/js",
        },
      });
      const data = await res.json();

      dispatch({ type: "city/created", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "there is a problem creating the  city",
      });
    }
  }
  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });

      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({
        type: "rejected",
        payload: "there is a problem deleting the  city",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        IsLoading,
        error,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside the citiesProvider");
  return context;
}

export { CitiesProvider, useCities };
