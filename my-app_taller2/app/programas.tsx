import { View, TextInput, Button, Alert } from "react-native";
import { useState } from "react";
import { crearPrograma } from "../database/database/db";
import { router } from "expo-router";

export default function Programas(){

const [cod,setCod]=useState("");
const [n1,setN1]=useState("");

const guardar=()=>{
const codigo = cod.trim();
const nombre = n1.trim();

if(codigo === "" || nombre === ""){
Alert.alert("Campos vacios","Codigo y nombre son obligatorios.");
return;
}

try{
crearPrograma(codigo,nombre,"","","");
router.replace("/estudiantes");
}catch{
Alert.alert("Error","No se pudo crear el programa.");
}

}

return(

<View
style={{
flex:1,
justifyContent:"center",
alignItems:"center",
padding:20
}}
>

<View style={{width:"100%",maxWidth:360}}>

<TextInput
placeholder="Codigo"
onChangeText={setCod}
style={{borderWidth:1,paddingHorizontal:10,paddingVertical:8}}
/>

<TextInput
placeholder="Nombre"
onChangeText={setN1}
style={{borderWidth:1,paddingHorizontal:10,paddingVertical:8,marginTop:10}}
/>

<View style={{marginTop:12}}>
<Button
title="Guardar Programa"
onPress={guardar}
/>
</View>

<View style={{marginTop:10}}>
<Button
title="Volver al inicio"
onPress={() => router.replace("/")}
/>
</View>

</View>

</View>

)

}
