import { months, serverIP } from "@/app/globalInfo";
import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
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

export default function EntryScreen() {
    const router = useRouter();
    const [entries, setEntries] = useState([]);
    const [isLoadingUser, setIsLoadingUser] = useState(true);

    useEffect(() => {
        async function loadUserData() {
            setIsLoadingUser(true);
            try {
                const loggedUserId = await AsyncStorage.getItem("userId");

                if (!loggedUserId) {
                    Alert.alert("Erro", "Usuário não encontrado. Faça login novamente.");
                    router.push("/");
                    return;
                }

                const response = await fetch(
                    `http://${serverIP}/userEntries/${loggedUserId}/${month}`
                );
                const dados = await response.json();

                if (response.ok) {
                    setEntries(dados);
                } else {
                    setEntries([]);
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

    const today = new Date;
    const [month, setMonth] = useState(today.getMonth() + 1);

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
        return data.slice(0, 10);
    };

    const formatValue = (value: string) => {
        value = value.toString();
        if (value.includes(".")) {
            return value.replace(".", ",");
        } else {
            return value.concat(",00");
        }

    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value || 0);
    };
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.replace("/home")}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Entradas</Text>
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
                    setMonth(item.value);
                    setIsLoadingUser(true);
                }}
                renderRightIcon={() => (
                    <Ionicons name="caret-down-outline" size={20} color="black" />
                )}
                renderItem={renderItem}
            />
            <SafeAreaProvider>
                <SafeAreaView style={styles.entryContainer}>
                    <ScrollView>
                        {entries.map((entData, i) =>
                            <View style={[styles.entry, {backgroundColor: `${handle.pickColor(entData.category)}`}]} key={i}>
                                <Ionicons name={handle.pickIcon(entData.category)} size={36} color={"black"} />
                                <View style={styles.entryTextContainer}>
                                    <Text style={styles.entryTitle}>{entData.name}</Text>
                                    <Text style={styles.entryDateTime}>{formatData(entData.data)}</Text>
                                </View>
                                <View style={styles.entryCost}>
                                    <Text style={styles.costText}>{formatCurrency(entData.value)}</Text>
                                </View>
                            </View>
                        )}
                    </ScrollView>
                </SafeAreaView>
            </SafeAreaProvider>
        </View>
    );
}