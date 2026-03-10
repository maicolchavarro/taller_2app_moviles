import { View, TextInput, Button, Alert } from "react-native";
import { useState } from "react";
import { crearEstudiante } from "../database/database/db";
import { router } from "expo-router";

export default function Crear(){

const [codigo,setCodigo]=useState("");
const [nombre,setNombre]=useState("");
const [email,setEmail]=useState("");
const [programa,setPrograma]=useState("");

const guardar=()=>{
const codigoLimpio = codigo.trim();
const nombreLimpio = nombre.trim();
const emailLimpio = email.trim();
const programaLimpio = programa.trim();

if(codigoLimpio === "" || nombreLimpio === "" || emailLimpio === ""){
Alert.alert("Campos vacios","Codigo, nombre y email son obligatorios.");
return;
}

try{
crearEstudiante(codigoLimpio,nombreLimpio,emailLimpio,programaLimpio);
router.replace("/estudiantes");
}catch(error){
const mensaje = String(error);
if(mensaje.includes("FOREIGN KEY constraint failed")){
Alert.alert(
  "Programa no valido",
  "El codigo de programa no existe. Crea el programa primero o deja el campo vacio."
);
return;
}
Alert.alert("Error","No se pudo guardar el estudiante.");
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
onChangeText={setCodigo}
style={{borderWidth:1,paddingHorizontal:10,paddingVertical:8}}
/>

<TextInput
placeholder="Nombre"
onChangeText={setNombre}
style={{borderWidth:1,marginTop:10,paddingHorizontal:10,paddingVertical:8}}
/>

<TextInput
placeholder="Email"
onChangeText={setEmail}
style={{borderWidth:1,marginTop:10,paddingHorizontal:10,paddingVertical:8}}
/>

<TextInput
placeholder="Programa Cod (opcional)"
onChangeText={setPrograma}
style={{borderWidth:1,marginTop:10,paddingHorizontal:10,paddingVertical:8}}
/>

<View style={{marginTop:12}}>
<Button
title="Guardar"
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
