import { View, TextInput, Button, Alert, Text } from "react-native";
import { useEffect, useState } from "react";
import { crearEstudiante } from "../database/database/db";
import { router, useLocalSearchParams } from "expo-router";

export default function Crear(){

const {programaCod}=useLocalSearchParams<{programaCod?:string | string[]}>();

const [codigo,setCodigo]=useState("");
const [nombre,setNombre]=useState("");
const [email,setEmail]=useState("");
const [programa,setPrograma]=useState("");

const programaDesdeRuta = Array.isArray(programaCod) ? programaCod[0] : programaCod;
const programaFijado = (programaDesdeRuta ?? "").trim();

useEffect(()=>{
if(programaFijado !== ""){
setPrograma(programaFijado);
}
},[programaFijado]);

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

{programaFijado !== "" ? (
<Text style={{marginBottom:10,textAlign:"center"}}>
Registrando estudiante para el programa: {programaFijado}
</Text>
) : null}

<TextInput
placeholder="Codigo"
placeholderTextColor="#000"
onChangeText={setCodigo}
style={{borderWidth:1,paddingHorizontal:10,paddingVertical:8}}
/>

<TextInput
placeholder="Nombre"
placeholderTextColor="#000"
onChangeText={setNombre}
style={{borderWidth:1,marginTop:10,paddingHorizontal:10,paddingVertical:8}}
/>

<TextInput
placeholder="Email"
placeholderTextColor="#000"
onChangeText={setEmail}
style={{borderWidth:1,marginTop:10,paddingHorizontal:10,paddingVertical:8}}
/>

<TextInput
placeholder={programaFijado !== "" ? "Programa seleccionado" : "Programa Cod (opcional)"}
placeholderTextColor="#000"
onChangeText={setPrograma}
value={programa}
editable={programaFijado === ""}
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
