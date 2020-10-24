import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const GistItem = ({ avatar, name, id, selectImage }) => {
  return (
    <TouchableOpacity onPress={() => selectImage(id)}>
      <View style={styles.container}>
        <Image source={{ uri: avatar }} style={styles.image} />
        <View style={styles.textHolder}>
          <Text style={styles.name}>{name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
  },
  image: {
    width: 60,
    height: 60,
  },
  textHolder: {
    padding: 20,
  },
  name: {
    fontSize: 20,
  },
});

export default GistItem;
