import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Image,
  Animated,
} from "react-native";
import axios from "axios";
import GistItem from "./GistItem";

export default function App() {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [imageFade, setImageFade] = useState(null);
  const [animateVisibility, setAnimateVisibility] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    const result = await axios(
      `https://api.github.com/gists/public?page=${page}&per_page=30`
    );

    let newList = [...list, ...result.data];
    setList(newList);
    setIsLoading(false);
  };

  const renderItem = ({ item }) => {
    let fileName = Object.keys(item.files)[0];

    return (
      <GistItem
        selectImage={handleSelectImage}
        avatar={item.owner.avatar_url}
        name={fileName}
        id={item.id}
      />
    );
  };

  const loadMore = () => {
    if (page == 1) {
      setPage(2);
    } else return;
  };

  const fadeIn = () => {
    setAnimateVisibility(true);

    setTimeout(() => {
      fadeOut();

      setTimeout(() => {
        setAnimateVisibility(false);
      }, 700);
    }, 1000);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleSelectImage = (id) => {
    let item = list.filter((item) => item.id === id)[0];
    let image = item.owner.avatar_url;
    setImageFade(image);
    fadeIn();
  };

  return isLoading ? (
    <ActivityIndicator
      size="large"
      style={{ flex: 1, justifyContent: "center", height: "100%" }}
    />
  ) : (
    <View style={styles.container}>
      <Text style={styles.title}>Gists</Text>

      {list.length !== 0 ? (
        <FlatList
          data={list}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onEndReached={loadMore}
          onEndReachedThreshold={0.9}
        />
      ) : (
        <Text>No data...</Text>
      )}

      {animateVisibility && (
        <Animated.View style={[styles.animatedView, { opacity: fadeAnim }]}>
          <Image source={{ uri: imageFade }} style={styles.animatedImage} />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    height: "100%",
    backgroundColor: "#fff",
    position: "relative",
  },
  title: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: "#eaeaea",
    fontSize: 20,
    fontWeight: "bold",
    flexShrink: 1,
  },
  animatedView: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  animatedImage: {
    width: 220,
    height: 220,
    zIndex: 999,
  },
});
