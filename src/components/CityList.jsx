import styles from "./CityList.module.css";
import Spinner from "./Spinner";
import CityItem from "./CityItem";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContexts";
function CityList() {
  const { cities, IsLoading } = useCities();
  if (IsLoading) return <Spinner />;

  if (!cities.length)
    return (
      <Message message="you can add your first city by clicking on the map" />
    );
  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
}

export default CityList;
