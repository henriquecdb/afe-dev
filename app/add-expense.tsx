import { categories, serverIP } from "@/app/globalInfo";
import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { styles } from "./style/commonStyle";

import {
  Alert,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import * as handle from "./handles";

export default function AddExpenseScreen() {
  const [category, setCategory] = useState();
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [dateText, setDateText] = useState("Agora, Hoje");

  const handleSave = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");

      if (!userId) {
        console.log("ID do usuário não encontrado");
        handle.handleRoute("/");
        return;
      }

      const response = await fetch(`http://${serverIP}/registerTransaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          value: value.replace(',', '.'),
          data: date.toISOString().slice(0, 10),
          category: category,
          id_user: userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar entrada");
      }
    } catch (error) {
      Alert.alert("Erro", error.message);
    } finally {
      Alert.alert("Sucesso", "Cadastro realizado com sucesso!", [
        {
          text: "OK",
          onPress: () => {
            setTimeout(() => {
              handle.handleRoute("/home");
            }, 100);
          },
        },
      ]);
    }
  };

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      setShowPicker(false);
      return;
    }
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === "ios");
    setDate(currentDate);
    setDateText(handle.formatDate(currentDate));
  };

  const showDatePicker = () => {
    setShowPicker(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => handle.handleRoute("/home")}
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
            style={styles.categoryDropdown}
            placeholderStyle={styles.categoryPlaceholderStyle}
            selectedTextStyle={styles.categorySelectedTextStyle}
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