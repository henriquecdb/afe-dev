import { months, serverIP } from "@/app/globalInfo";
import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as handle from "./handles";
import { styles } from "./style/commonStyle";

export default function ExpenseScreen() {
    const today = new Date;
    const [month, setMonth] = useState(today.getMonth() + 1);
    const [expenses, setExpenses] = useState([]);
    const [isLoadingUser, setIsLoadingUser] = useState(true);

    useEffect(() => {
        async function loadUserData() {
            setIsLoadingUser(true);
            try {
                const loggedUserId = await AsyncStorage.getItem("userId");

                if (!loggedUserId) {
                    Alert.alert("Erro", "Usuário não encontrado. Faça login novamente.");
                    handle.handleRoute("/");
                    return;
                }

                const response = await fetch(
                    `http://${serverIP}/userExpenses/${loggedUserId}/${month}`
                );
                const dados = await response.json();

                if (response.ok) {
                    setExpenses(dados);
                } else {
                    setExpenses([]);
                }
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
                Alert.alert("Erro", "Não foi possível carregar os dados do usuário" + error);
            } finally {
                setIsLoadingUser(false);
            }
        }

        if (isLoadingUser) {
            loadUserData();
        }
    });

    const renderItem = item => {
        return (
            <View style={styles.item}>
                <Text style={styles.textItem}>{item.label}</Text>
                {item.value === month && (
                    <Feather name="check-circle" size={20} color="black" />
                )}
            </View>
        );
    };

    const formatData = (data: string) => {
        const dia = new Date(data);
        console.log(dia.toLocaleDateString("pt-br", {weekday: "long", month: "short", year: "numeric"}));
        return dia.toLocaleDateString("pt-BR", {weekday: "long", month: "short", year: "numeric"})
        // return data.slice(0, 10);
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
                <Text style={styles.headerTitle}>Saídas</Text>
                <View style={styles.headerSpacer} />
            </View>

            <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                iconStyle={styles.iconStyle}
                data={months}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Selecione o mês"
                value={month}
                onChange={(item) => {
                    setIsLoadingUser(true);
                    setMonth(item.value);
                }}
                renderRightIcon={() => (
                    <Ionicons name="caret-down-outline" size={20} color="black" />
                )}
                renderItem={renderItem}
            />
            <SafeAreaProvider>
                <SafeAreaView style={styles.entryContainer}>
                    <ScrollView>
                        {expenses.map((expData, i) =>
                            <View style={[styles.entry, { backgroundColor: `${handle.pickColor(expData.category)}` }]} key={i}>
                                <Ionicons name={handle.pickIcon(expData.category)} size={36} color={"black"} />
                                <View style={styles.entryTextContainer}>
                                    <Text style={styles.entryTitle}>{expData.name}</Text>
                                    <Text style={styles.entryDateTime}>{formatData(expData.data)}</Text>
                                </View>
                                <View style={styles.entryCost}>
                                    <Text style={styles.costText}>- {handle.formatCurrency(expData.value)}</Text>
                                </View>
                            </View>
                        )}
                    </ScrollView>
                </SafeAreaView>
            </SafeAreaProvider>
        </View>
    );
}