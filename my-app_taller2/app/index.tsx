import { View, Text, Button, Alert } from "react-native";
import { useEffect } from "react";
import { router } from "expo-router";
import { initDB } from "../database/database/db";

export default function Index() {

  useEffect(() => {
    try{
      initDB();
    }catch{
      Alert.alert("Error","No se pudo inicializar la base de datos.");
    }
  }, []);

  return (

    <View
      style={{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        padding:20
      }}
    >

      <View style={{ width:"100%", maxWidth:320 }}>
        <Text
          style={{
            fontSize:22,
            marginBottom:20,
            textAlign:"center"
          }}
        >
          Taller SQLite App
        </Text>

        <Button
          title="Ir a Programas"
          onPress={() => router.push("/programas")}
        />

        <View style={{ height: 12 }} />

        <Button
          title="Ir a Estudiantes"
          onPress={() => router.push("/estudiantes")}
        />
      </View>

    </View>

  );
}
