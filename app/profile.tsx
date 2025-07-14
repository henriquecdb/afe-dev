import { serverIP } from "@/app/globalInfo";
import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { styles } from "./style/profileStyle";

export default function ProfileScreen() {
  const router = useRouter();

  const [userData, setUserData] = useState({
    id: null,
    name: "",
    email: "",
    objective: "",
  });

  const [editingData, setEditingData] = useState({
    email: "",
    password: "",
    objective: "",
  });

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isEditingObjective, setIsEditingObjective] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const loadUserData = useCallback(async () => {
    setIsLoadingUser(true);
    try {
      const loggedUserId = await AsyncStorage.getItem("userId");

      if (!loggedUserId) {
        Alert.alert("Erro", "Usuário não encontrado. Faça login novamente.");
        router.push("/");
        return;
      }

      const response = await fetch(
        `http://${serverIP}/user/${loggedUserId}`
      );
      const data = await response.json();

      if (response.ok) {
        setUserData(data);
        setEditingData({
          email: data.email,
          password: "",
          objective: data.objective || "500,00 R$",
        });
      } else {
        Alert.alert("Erro", "Não foi possível carregar os dados do usuário");
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados do usuário");
    } finally {
      setIsLoadingUser(false);
    }
  }, [router]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleEditEmail = () => {
    if (isEditingEmail) {
      setEditingData((prev) => ({ ...prev, email: userData.email }));
    } else {
      setEditingData((prev) => ({ ...prev, email: userData.email }));
    }
    setIsEditingEmail(!isEditingEmail);
  };

  const handleEditPassword = () => {
    if (isEditingPassword) {
      setEditingData((prev) => ({ ...prev, password: "" }));
    } else {
      setEditingData((prev) => ({ ...prev, password: "" }));
    }
    setIsEditingPassword(!isEditingPassword);
  };

  const handleEditObjective = () => {
    if (isEditingObjective) {
      setEditingData((prev) => ({ ...prev, objective: userData.objective }));
    } else {
      setEditingData((prev) => ({ ...prev, objective: userData.objective }));
    }
    setIsEditingObjective(!isEditingObjective);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);

    try {
      const updateData: {
        email?: string;
        password?: string;
        objective?: string;
      } = {};

      if (isEditingEmail && editingData.email !== userData.email) {
        updateData.email = editingData.email;
      }

      if (isEditingPassword && editingData.password.trim() !== "") {
        updateData.password = editingData.password;
      }

      if (isEditingObjective && editingData.objective !== userData.objective) {
        updateData.objective = editingData.objective;
      }

      if (Object.keys(updateData).length === 0) {
        Alert.alert("Aviso", "Nenhuma alteração foi detectada");
        setIsSaving(false);
        return;
      }

      const response = await fetch(
        `http://${serverIP}/user/${userData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso", "Dados atualizados com sucesso!");

        setUserData((prev) => ({
          ...prev,
          ...updateData,
          password: undefined,
        }));

        setIsEditingEmail(false);
        setIsEditingPassword(false);
        setIsEditingObjective(false);
        setEditingData((prev) => ({ ...prev, password: "" }));
      } else {
        Alert.alert(
          "Erro",
          result.error || "Não foi possível atualizar os dados"
        );
      }
    } catch (err) {
      console.error("Erro de conexão:", err);
      Alert.alert("Erro", "Erro de conexão. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarEdit = () => {
    Alert.alert("Editar Avatar", "Escolha uma opção:", [
      { text: "Câmera", onPress: () => console.log("Abrir câmera") },
      { text: "Galeria", onPress: () => console.log("Abrir galeria") },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  const hasChanges = isEditingEmail || isEditingPassword || isEditingObjective;

  if (isLoadingUser) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/home")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainerLarge}>
            <Text style={styles.avatarTextLarge}>
              {getInitials(userData.name)}
            </Text>
            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={handleAvatarEdit}
            >
              <Feather name="edit-2" size={16} color="#666" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{userData.name}</Text>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.inputContainer}>
            <Feather
              name="mail"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, !isEditingEmail && styles.inputDisabled]}
              value={isEditingEmail ? editingData.email : userData.email}
              onChangeText={(text) =>
                setEditingData((prev) => ({ ...prev, email: text }))
              }
              placeholder="Email"
              placeholderTextColor="#aaa"
              editable={isEditingEmail}
            />
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditEmail}
            >
              <Feather
                name={isEditingEmail ? "x" : "edit-2"}
                size={18}
                color={isEditingEmail ? "#ff4444" : "#666"}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Feather
              name="lock"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, !isEditingPassword && styles.inputDisabled]}
              value={isEditingPassword ? editingData.password : "••••••••••"}
              onChangeText={(text) =>
                setEditingData((prev) => ({ ...prev, password: text }))
              }
              placeholder="Nova senha"
              secureTextEntry={true}
              placeholderTextColor="#aaa"
              editable={isEditingPassword}
            />
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditPassword}
            >
              <Feather
                name={isEditingPassword ? "x" : "edit-2"}
                size={18}
                color={isEditingPassword ? "#ff4444" : "#666"}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionLabel}>Objetivo</Text>
          <View style={styles.objectiveContainer}>
            <TextInput
              style={[
                styles.objectiveInput,
                !isEditingObjective && styles.inputDisabled,
              ]}
              value={
                isEditingObjective ? editingData.objective : userData.objective
              }
              onChangeText={(text) =>
                setEditingData((prev) => ({ ...prev, objective: text }))
              }
              keyboardType="numeric"
              placeholder="Defina seu objetivo financeiro"
              placeholderTextColor="#aaa"
              editable={isEditingObjective}
            />
            <TouchableOpacity
              style={styles.editObjectiveButton}
              onPress={handleEditObjective}
            >
              <Feather
                name={isEditingObjective ? "x" : "edit-2"}
                size={18}
                color={isEditingObjective ? "#ff4444" : "#666"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {hasChanges && (
          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSaveChanges}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Salvar Alterações</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

/*const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: "#fff",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatarContainerLarge: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#E6F0F9",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  avatarTextLarge: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#666",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "white",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginTop: 12,
  },
  infoSection: {
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#666",
  },
  inputDisabled: {
    color: "#999",
    backgroundColor: "#f5f5f5",
  },
  editButton: {
    padding: 5,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
    marginBottom: 8,
  },
  objectiveContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  objectiveInput: {
    flex: 1,
    fontSize: 16,
    color: "#666",
  },
  editObjectiveButton: {
    padding: 5,
  },
  saveButton: {
    backgroundColor: "#FFD580",
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonDisabled: {
    backgroundColor: "#B0C4DE",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});*/
