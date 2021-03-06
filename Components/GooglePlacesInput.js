import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Keyboard,
} from "react-native";

import { searchLocation, fetchLatLng } from "./api";

const GooglePlacesInput = ({ setSelectedPlace }) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState();
  const [isShowing, setIsShowing] = useState(false);

  const handleInput = (e) => {
    setSearchKeyword(e);
    searchLocation(e).then((data) => {
      const predictions = data.map((datum) => {
        return { name: datum.description, id: datum.place_id };
      });
      setSearchResults(predictions);
    });
    setIsShowing(true);
  };

  const moveMap = (id) => {
    fetchLatLng(id).then((data) => {
      setSelectedPlace(data);
    });
    setSearchKeyword("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.autocompleteContainer}>
        <TextInput
          placeholder="Search"
          style={styles.searchBox}
          placeholderTextColor="#000"
          onChangeText={handleInput}
          value={searchKeyword}
          returnKeyType="search"
        />

        {isShowing && (
          <FlatList
            data={searchResults}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.resultItem}
                  onPress={() => {
                    moveMap(item.id);
                    Keyboard.dismiss();
                    setIsShowing(false);
                  }}
                >
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => item.id}
            style={styles.searchResultsContainer}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default GooglePlacesInput;

const styles = StyleSheet.create({
  autocompleteContainer: {
    zIndex: 1,
  },

  searchResultsContainer: {
    width: 310,
    height: 150,
    backgroundColor: "#fff",
    marginLeft: 30,
  },

  resultItem: {
    width: "100%",
    justifyContent: "center",
    height: 40,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    paddingLeft: 15,
  },

  searchBox: {
    width: 320,
    height: 50,
    fontSize: 18,
    borderRadius: 8,
    borderColor: "#aaa",
    color: "#000",
    backgroundColor: "#fff",
    borderWidth: 1.5,
    paddingLeft: 15,
    marginLeft: 25,
    marginTop: 30,
  },

  autocompleteContainer: {
    justifyContent: "center",
  },

  container: {
    position: "absolute",
  },
});
