import { createStackNavigator } from "@react-navigation/stack";

import PostsScreen from "./NestedStack/PostsScreen";
import MapScreen from "./NestedStack/MapScreen";
import CommentsScreen from "./NestedStack/CommentsScreen";

const PostsStack = createStackNavigator();

export default function PostsScreenStack() { 
  return (
    <PostsStack.Navigator initialRouteName="Posts" >
      <PostsStack.Screen name="Posts" component={PostsScreen} options={{headerShown: false}}/>
      <PostsStack.Screen name="Map" component={MapScreen} />
      <PostsStack.Screen name="Comments" component={CommentsScreen}/>
    </PostsStack.Navigator>
  )
};