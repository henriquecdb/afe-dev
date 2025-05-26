import { Feather, Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RecoverView() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [codigo, setCodigo] = useState("");

  const handleRecover = () => {
    // Lógica de recuperação aqui
  };

  return (
    <View style={styles.background}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Feather name="arrow-left" size={24} color="#222" />
      </Pressable>
      <View style={styles.container}>
        <Text style={styles.title}>Recupere sua senha</Text>

        <View style={styles.inputContainer}>
          <Feather name="mail" size={20} color="#222" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.inputContainer}>
          <Feather name="lock" size={20} color="#222" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nova senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.inputContainer}>
          <Octicons name="code" size={20} color="#222" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Código"
            value={codigo}
            onChangeText={setCodigo}
            placeholderTextColor="#aaa"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRecover}>
          <Text style={styles.buttonText}>ENVIAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 24,
    zIndex: 2,
  },
  container: {
    width: "100%",
    maxWidth: 370,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 32,
    alignItems: "stretch",
    position: "relative",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 32,
    marginTop: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ddd",
    borderWidth: 1.5,
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    height: 48,
    width: "100%",
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#222",
  },
  button: {
    backgroundColor: "#FFD580",
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: "center",
    marginBottom: 24,
    marginTop: 16,
    width: "70%",
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1,
  },
});
