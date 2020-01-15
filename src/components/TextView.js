import React from "react";
import {Text} from "react-native";

import styles from "../styles.js";

const TextView = (props) => {
  return (
    <Text {...props} style={[styles.textView, props.style]}>
      {props.children}
    </Text>
  );
};

export default TextView;