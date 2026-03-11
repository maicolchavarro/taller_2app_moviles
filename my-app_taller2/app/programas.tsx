import { View, TextInput, Button, Alert, FlatList, Text, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import {
  crearPrograma,
  obtenerProgramas,
  actualizarPrograma,
  eliminarPrograma,
  obtenerEstudiantesPorPrograma
} from "../database/database/db";
import { router } from "expo-router";

type Programa = {
  cod: string;
  nombre1: string;
};

type EstudiantePrograma = {
  codigo: string;
  nombre: string;
  email: string;
  programa_cod: string;
};

export default function Programas() {
  const [cod, setCod] = useState("");
  const [n1, setN1] = useState("");
  const [lista, setLista] = useState<Programa[]>([]);
  const [codigoEditando, setCodigoEditando] = useState("");
  const [nombreEditado, setNombreEditado] = useState("");
  const [programaSeleccionado, setProgramaSeleccionado] = useState<Programa | null>(null);
  const [estudiantesPrograma, setEstudiantesPrograma] = useState<EstudiantePrograma[]>([]);

  const cargarProgramas = () => {
    try {
      const datos = obtenerProgramas() as Programa[];
      setLista(datos);

      if (programaSeleccionado) {
        const vigente = datos.find((item) => item.cod === programaSeleccionado.cod) ?? null;
        setProgramaSeleccionado(vigente);
      }
    } catch {
      Alert.alert("Error", "No se pudo cargar la lista de programas.");
    }
  };

  const cargarEstudiantesDelPrograma = (programaCod: string) => {
    try {
      const datos = obtenerEstudiantesPorPrograma(programaCod) as EstudiantePrograma[];
      setEstudiantesPrograma(datos);
    } catch {
      Alert.alert("Error", "No se pudo cargar estudiantes del programa.");
    }
  };

  useEffect(() => {
    try {
      const datos = obtenerProgramas() as Programa[];
      setLista(datos);
    } catch {
      Alert.alert("Error", "No se pudo cargar la lista de programas.");
    }
  }, []);

  useEffect(() => {
    if (programaSeleccionado) {
      cargarEstudiantesDelPrograma(programaSeleccionado.cod);
    } else {
      setEstudiantesPrograma([]);
    }
  }, [programaSeleccionado]);

  const guardar = () => {
    const codigo = cod.trim();
    const nombre = n1.trim();

    if (codigo === "" || nombre === "") {
      Alert.alert("Campos vacios", "Codigo y nombre son obligatorios.");
      return;
    }

    try {
      crearPrograma(codigo, nombre, "", "", "");
      setCod("");
      setN1("");
      cargarProgramas();
      Alert.alert("Exito", "Programa creado.");
    } catch {
      Alert.alert("Error", "No se pudo crear el programa.");
    }
  };

  const iniciarEdicion = (codigo: string, nombre: string) => {
    setCodigoEditando(codigo);
    setNombreEditado(nombre);
  };

  const cancelarEdicion = () => {
    setCodigoEditando("");
    setNombreEditado("");
  };

  const guardarEdicion = (codigo: string) => {
    const nuevoNombre = nombreEditado.trim();

    if (nuevoNombre === "") {
      Alert.alert("Campo vacio", "El nombre no puede quedar vacio.");
      return;
    }

    try {
      actualizarPrograma(codigo, nuevoNombre);
      cancelarEdicion();

      if (programaSeleccionado?.cod === codigo) {
        setProgramaSeleccionado({ cod: codigo, nombre1: nuevoNombre });
      }

      cargarProgramas();
    } catch {
      Alert.alert("Error", "No se pudo modificar el programa.");
    }
  };

  const confirmarEliminar = (codigo: string) => {
    Alert.alert("Eliminar programa", "Esta accion eliminara el programa seleccionado.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          try {
            eliminarPrograma(codigo);

            if (codigoEditando === codigo) {
              cancelarEdicion();
            }

            if (programaSeleccionado?.cod === codigo) {
              setProgramaSeleccionado(null);
              setEstudiantesPrograma([]);
            }

            cargarProgramas();
          } catch {
            Alert.alert("Error", "No se pudo eliminar el programa.");
          }
        }
      }
    ]);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20
      }}
    >
      <View style={{ width: "100%", maxWidth: 360 }}>
        <TextInput
          placeholder="Codigo"
          placeholderTextColor="#000"
          onChangeText={setCod}
          value={cod}
          style={{ borderWidth: 1, paddingHorizontal: 10, paddingVertical: 8 }}
        />

        <TextInput
          placeholder="Nombre"
          placeholderTextColor="#000"
          onChangeText={setN1}
          value={n1}
          style={{ borderWidth: 1, paddingHorizontal: 10, paddingVertical: 8, marginTop: 10 }}
        />

        <View style={{ marginTop: 12 }}>
          <Button title="Guardar Programa" onPress={guardar} />
        </View>

        <View style={{ marginTop: 10 }}>
          <Button title="Volver al inicio" onPress={() => router.replace("/")} />
        </View>

        <Text style={{ marginTop: 18, fontWeight: "bold", fontSize: 16, textAlign: "center" }}>
          Programas registrados
        </Text>

        <FlatList
          data={lista}
          keyExtractor={(item) => item.cod}
          style={{ marginTop: 10, maxHeight: 220 }}
          ListEmptyComponent={<Text style={{ textAlign: "center" }}>No hay programas registrados.</Text>}
          renderItem={({ item }) => (
            <View
              style={{
                borderWidth: 1,
                borderColor: programaSeleccionado?.cod === item.cod ? "#1a73e8" : "#000000",
                padding: 10,
                marginTop: 8
              }}
            >
              <TouchableOpacity onPress={() => setProgramaSeleccionado(item)}>
                <Text>Codigo: {item.cod}</Text>
                <Text>Nombre: {item.nombre1}</Text>
                <Text style={{ color: "#1a73e8", marginTop: 6 }}>Tocar para seleccionar este programa</Text>
              </TouchableOpacity>

              {codigoEditando === item.cod ? (
                <>
                  <TextInput
                    value={nombreEditado}
                    onChangeText={setNombreEditado}
                    placeholder="Nuevo nombre"
                    placeholderTextColor="#000"
                    style={{ borderWidth: 1, paddingHorizontal: 10, paddingVertical: 8, marginTop: 10 }}
                  />
                  <View style={{ flexDirection: "row", marginTop: 8 }}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <Button title="Guardar cambios" onPress={() => guardarEdicion(item.cod)} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Button title="Cancelar" onPress={cancelarEdicion} color="#666666" />
                    </View>
                  </View>
                </>
              ) : (
                <View style={{ flexDirection: "row", marginTop: 8 }}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Button title="Modificar" onPress={() => iniciarEdicion(item.cod, item.nombre1 ?? "")} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Button title="Eliminar" onPress={() => confirmarEliminar(item.cod)} color="#b00020" />
                  </View>
                </View>
              )}
            </View>
          )}
        />

        {programaSeleccionado ? (
          <>
            <Text style={{ marginTop: 14, fontWeight: "bold", fontSize: 16, textAlign: "center" }}>
              Programa seleccionado: {programaSeleccionado.nombre1} ({programaSeleccionado.cod})
            </Text>

            <View style={{ marginTop: 10 }}>
              <Button
                title="Deseleccionar programa"
                onPress={() => setProgramaSeleccionado(null)}
                color="#666666"
              />
            </View>

            <View style={{ marginTop: 10 }}>
              <Button
                title="Crear Estudiante"
                onPress={() =>
                  router.push({ pathname: "/crearEstudiante", params: { programaCod: programaSeleccionado.cod } })
                }
              />
            </View>

            <Text style={{ marginTop: 14, fontWeight: "bold", fontSize: 15, textAlign: "center" }}>
              Estudiantes registrados en este programa
            </Text>

            <FlatList
              data={estudiantesPrograma}
              keyExtractor={(item) => item.codigo}
              style={{ marginTop: 8, maxHeight: 200 }}
              ListEmptyComponent={<Text style={{ textAlign: "center" }}>No hay estudiantes en este programa.</Text>}
              renderItem={({ item }) => (
                <View
                  style={{
                    borderWidth: 1,
                    padding: 10,
                    marginTop: 8
                  }}
                >
                  <Text>Codigo: {item.codigo}</Text>
                  <Text>Nombre: {item.nombre}</Text>
                  <Text>Email: {item.email}</Text>
                </View>
              )}
            />
          </>
        ) : null}
      </View>
    </View>
  );
}
