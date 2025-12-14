declare module 'react-native-vector-icons/MaterialIcons' {
  import { Component } from 'react';
  import { ViewStyle, TextStyle } from 'react-native';

  export interface IconProps {
    name: string;
    size?: number;
    color?: string | number;
    style?: ViewStyle | TextStyle | Array<ViewStyle | TextStyle>;
  }

  export default class Icon extends Component<IconProps> {}
}
