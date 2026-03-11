import { View, TextInput, Button, Alert } from "react-native";
import { useState } from "react";
import { actualizarEstudiante } from "../database/database/db";
import { router, useLocalSearchParams } from "expo-router";

export default function Editar(){

const {codigo}=useLocalSearchParams();

const [nombre,setNombre]=useState("");
const [programa,setPrograma]=useState("");

const actualizar=()=>{
const codigoEstudiante = String(codigo ?? "").trim();
const nombreLimpio = nombre.trim();
const programaLimpio = programa.trim();

if(codigoEstudiante === ""){
Alert.alert("Error","No se encontro el codigo del estudiante.");
return;
}

if(nombreLimpio === ""){
Alert.alert("Campos vacios","Debes escribir el nuevo nombre.");
return;
}

try{
actualizarEstudiante(
 codigoEstudiante,
 nombreLimpio,
 programaLimpio
);
router.replace("/estudiantes");
}catch(error){
const mensaje = String(error);
if(mensaje.includes("FOREIGN KEY constraint failed")){
Alert.alert(
  "Programa no valido",
  "El codigo de programa no existe. Usa un codigo existente o deja el campo vacio."
);
return;
}
Alert.alert("Error","No se pudo actualizar el estudiante.");
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
placeholder="Nuevo nombre"
placeholderTextColor="#000"
onChangeText={setNombre}
style={{borderWidth:1,paddingHorizontal:10,paddingVertical:8}}
/>

<TextInput
placeholder="Nuevo programa"
placeholderTextColor="#000"
onChangeText={setPrograma}
style={{borderWidth:1,marginTop:10,paddingHorizontal:10,paddingVertical:8}}
/>

<View style={{marginTop:12}}>
<Button
title="Actualizar"
onPress={actualizar}
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
