import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Alert } from "react-native";
import { useEffect, useState } from "react";
import { 
  obtenerEstudiantes,
  buscarEstudiante,
  eliminarEstudiante
} from "../database/database/db";
import { router } from "expo-router";

export default function Estudiantes(){

const [lista,setLista]=useState<any[]>([]);
const [texto,setTexto]=useState("");

const cargar=()=>{
  try{
    const datos=obtenerEstudiantes();
    setLista(datos);
  }catch{
    Alert.alert("Error","No se pudieron cargar los estudiantes.");
  }
}

useEffect(()=>{
  cargar();
},[])

const buscar=()=>{
  const filtro = texto.trim();

  if(filtro === ""){
    cargar();
    return;
  }

  try{
    const datos=buscarEstudiante(filtro);
    setLista(datos);
  }catch{
    Alert.alert("Error","No se pudo realizar la busqueda.");
  }
}

const eliminar=(codigo:string)=>{
  try{
    eliminarEstudiante(codigo);
    cargar();
  }catch{
    Alert.alert("Error","No se pudo eliminar el estudiante.");
  }
}

return(

<View
style={{
flex:1,
alignItems:"center",
padding:20
}}
>

<View style={{width:"100%",maxWidth:420}}>

<TextInput
placeholder="Buscar por codigo o nombre"
placeholderTextColor="#000"
onChangeText={setTexto}
style={{borderWidth:1,marginBottom:10,paddingHorizontal:10,paddingVertical:8}}
/>

<View style={{marginBottom:10}}>
<Button title="Buscar" onPress={buscar}/>
</View>

<Button
title="Crear Estudiante"
onPress={()=>router.push("/crearEstudiante")}
/>

<View style={{marginTop:10}}>
<Button
title="Volver al inicio"
onPress={() => router.replace("/")}
/>
</View>

<FlatList
data={lista}
keyExtractor={(item)=>item.codigo}

renderItem={({item})=>(

<View style={{
borderWidth:1,
padding:10,
marginTop:10,
width:"100%"
}}>

<Text>Codigo: {item.codigo}</Text>
<Text>Nombre: {item.nombre}</Text>
<Text>Email: {item.email}</Text>
<Text>Programa: {item.programa_cod}</Text>

<View style={{flexDirection:"row",justifyContent:"center",marginTop:8}}>

<TouchableOpacity
onPress={()=>router.push({
pathname:"/editarEstudiante",
params:{codigo:item.codigo}
})}
>

<Text style={{color:"blue"}}>Editar</Text>

</TouchableOpacity>

<TouchableOpacity
onPress={()=>eliminar(item.codigo)}
>

<Text style={{color:"red",marginLeft:20}}>
Eliminar
</Text>

</TouchableOpacity>

</View>

</View>

)}
/>

</View>

</View>

)
}
