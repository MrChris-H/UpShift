import MapView, { Polyline, PROVIDER_GOOGLE, Polygon } from "react-native-maps";
import {
  View,
  StyleSheet,
  Button,
  TextInput,
  SafeAreaView,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import GooglePlacesInput from "./GooglePlacesInput";
import { snapToRoad } from "./api";

import firebase from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
const db = firebase.firestore();

export const SavedRoutes = ({ route }) => {
  const _map = useRef(null);
  const [points, setPoints] = useState(route.params.location);
  const [snapped, setSnapped] = useState(false);
  const [drawMethod, setDrawMethod] = useState("Polyline");
  const [routeNameField, setRouteNameField] = useState(false);
  const [routeName, setRouteName] = useState("");

  const [selectedPlace, setSelectedPlace] = useState({
    lat: route.params.location[0].latitude,
    lng: route.params.location[0].longitude,
  });

  useEffect(() => {
    if (_map.current) {
      _map.current.animateCamera({
        center: {
          latitude: selectedPlace.lat,
          longitude: selectedPlace.lng,
        },
        zoom: 13,
      });
    }
  }, [selectedPlace]);

  const drawPolyLine = (e) => {
    const latitude = Number(e.nativeEvent.coordinate.latitude);
    const longitude = Number(e.nativeEvent.coordinate.longitude);
    setPoints((currentState) => [
      ...currentState,
      {
        latitude,
        longitude,
      },
    ]);
  };

  const snapPoints = () => {
    const pointString = points.reduce((prev, curr, index) => {
      if (index === points.length - 1) {
        return prev + curr.latitude + "," + curr.longitude;
      }
      return (prev += curr.latitude + "," + curr.longitude + "|");
    }, "");

    snapToRoad(pointString).then((data) => {
      const snappedPoints = data.map((datum) => {
        return datum.location;
      });
      setPoints(snappedPoints);
    });
    setSnapped(true);
  };

  const resetPolygon = () => {
    setPoints([]);
  };

  const undoLastPoint = () => {
    setPoints(points.slice(0, -1));
  };

  const saveRoute = async () => {
    if (snapped && routeName.length > 0) {
      const route = { myRoute: points };
      try {
        const newroute = await setDoc(
          doc(db, `profiles/vr9xGysRo7OpkOEQZ3yAyLkRCg92/routes/${routeName}`),
          route
        );
        return newroute;
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log("please snap to road before saving");
    }
  };

  return (
    <View>
      <View style={styles.searchbar}>
        <GooglePlacesInput setSelectedPlace={setSelectedPlace} />
      </View>

      <View style={styles.toolbar}>
        <Button title="Clear" color="black" onPress={resetPolygon} />
        <Button
          title="Save"
          color="black"
          onPress={() => setRouteNameField((curr) => !curr)}
        />
        <Button title="Undo" color="black" onPress={undoLastPoint} />
        <Button
          title={drawMethod}
          color="black"
          onPress={() => {
            drawMethod === "Polyline"
              ? setDrawMethod("Polygon")
              : setDrawMethod("Polyline");
          }}
        />
      </View>
      {routeNameField ? (
        <View style={styles.routeNameInput}>
          <SafeAreaView>
            <TextInput
              placeholder="Enter a name for this route..."
              onChangeText={(e) => setRouteName(e)}
              onSubmitEditing={saveRoute}
              placeholderTextColor="black"
              returnKeyType="done"
            />
          </SafeAreaView>
        </View>
      ) : null}

      <View style={styles.map}>
        <MapView
          zoomTapEnabled={false}
          ref={_map}
          customMapStyle={mapStyle}
          style={{ height: "100%", width: "100%" }}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          onPress={drawPolyLine}
          onLongPress={snapPoints}
          loadingEnabled={true}
          //UI buttons?
          showsTraffic={true}
        >
          {points.length < 2 ? null : drawMethod === "Polyline" ? (
            <Polygon coordinates={points} strokeWidth={3} strokeColor="black" />
          ) : (
            <Polyline
              coordinates={points}
              strokeWidth={3}
              strokeColor="black"
            />
          )}
        </MapView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  routeNameInput: {
    flex: 1,
    position: "absolute",
    bottom: 430,
    left: 35,
    zIndex: 2,
    width: 340,
    height: 50,
    fontSize: 18,
    borderRadius: 8,
    borderColor: "#aaa",
    borderWidth: 1.5,
  },
  toolbar: {
    zIndex: 2,
    position: "absolute",
    bottom: 60,
    right: 30,
  },
  searchbar: {
    zIndex: 2,
  },
  map: {
    zIndex: 1,
  },
});

const mapStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#f5f5f5",
      },
    ],
  },
  {
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#f5f5f5",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#bdbdbd",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [
      {
        color: "#eeeeee",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "poi.business",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#e5e5e5",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#dadada",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "labels",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [
      {
        color: "#e5e5e5",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [
      {
        color: "#eeeeee",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#c9c9c9",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
];