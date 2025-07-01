import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const categories = [
  { label: "Entrada", value: 0 },
  { label: "Essenciais", value: 1 },
  { label: "Alimentação", value: 2 },
  { label: "Imprevistos", value: 3 },
  { label: "Besteiras", value: 4 },
  { label: "Lazer", value: 5 },
];

export default function AddExpenseScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [idLogged, setIdLogged] = useState();
  const [userData, setUserData] = useState({
    name: "Carregando...",
    objective: 0,
  });

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function loadUserData() {
      try {
        const userId = await AsyncStorage.getItem("userId");

        if (!userId) {
          console.log("ID do usuário não encontrado");
          router.replace("/");
          return;
        }

        setIdLogged(userId);
        
        const response = await fetch(`http://192.168.1.118:3001/user/${userId}`);

        if (!response.ok) {
          throw new Error("Falha ao buscar dados do usuário");
        }

        const data = await response.json();
        setUserData({
          name: data.name || "Usuário",
          objective: data.objective || 0,
        });
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, []);

  const [category, setCategory] = useState();
  const [name, setName] = useState("");
  const [value, setValue] = useState("");

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [dateText, setDateText] = useState("Agora, Hoje");

  const handleSave = async () => {
    setIsLoading(true);

    try {
      if (category == 0) {
        const response = await fetch("http://192.168.1.118:3001/registerEntry", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            value: value.replace(',', '.'),
            data: date.toISOString().slice(0, 10),
            category: category,
            id_user: idLogged,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Erro ao cadastrar entrada");
        }
      } else {
        const response = await fetch("http://192.168.1.118:3001/registerExpense", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            value: value.replace(',', '.'),
            data: date.toISOString().slice(0, 10),
            category: category,
            id_user: idLogged,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Erro ao cadastrar despesa");
        }
      }


      Alert.alert("Sucesso", "Cadastro realizado com sucesso!", [
        {
          text: "OK",
          onPress: () => {
            setTimeout(() => {
              router.replace("/home");
            }, 100);
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Erro", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    if (isToday(date)) {
      return "Agora, Hoje";
    }

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      setShowPicker(false);
      return;
    }
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === "ios");
    setDate(currentDate);
    setDateText(formatDate(currentDate));
  };

  const showDatePicker = () => {
    setShowPicker(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Registrar</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Categoria</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={categories}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Selecione a categoria"
            value={category}
            onChange={(item) => {
              setCategory(item.value);
            }}
            renderRightIcon={() => (
              <Feather name="chevron-down" size={20} color="#777" />
            )}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ex.: Compras do Mercado"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Valor</Text>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={setValue}
            placeholder="0,00 R$"
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Data</Text>
          <TouchableOpacity
            style={styles.dateInputContainer}
            onPress={showDatePicker}
          >
            <Text style={styles.dateInput}>{dateText}</Text>
            <Feather
              name="calendar"
              size={20}
              color="#777"
              style={styles.calendarIcon}
            />
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              display="default"
              onChange={onChange}
            />
          )}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>SALVAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#333",
  },
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#999",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#333",
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    paddingVertical: 12,
  },
  dateInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  calendarIcon: {
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: "#FFD580",
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: "center",
    marginBottom: 24,
    marginTop: 4,
    width: "70%",
    alignSelf: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1,
  },
});
