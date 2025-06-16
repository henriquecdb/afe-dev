import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const months = [
    { label: "Janeiro", value: "1" },
    { label: "Fevereiro", value: "2" },
    { label: "Março", value: "3" },
    { label: "Abril", value: "4" },
    { label: "Maio", value: "5" },
    { label: "Junho", value: "6" },
    { label: "Julho", value: "7" },
    { label: "Agosto", value: "8" },
    { label: "Setembro", value: "9" },
    { label: "Outubro", value: "10" },
    { label: "Novembro", value: "11" },
    { label: "Dezembro", value: "12" },
];

export default function ExpenseScreen() {
    const router = useRouter();
    const [month, setMonth] = useState("4");

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

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
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
                }}
                renderRightIcon={() => (
                    <Ionicons name="caret-down-outline" size={20} color="black" />
                )}
                renderItem={renderItem}
            />
            <View style={styles.entryContainer}>
                <View style={styles.entry}>
                    <Ionicons name="wallet-outline" size={36} color={"black"} />
                    <View style={styles.entryTextContainer}>
                        <Text style={styles.entryTitle}>Venda Bicicleta</Text>
                        <Text style={styles.entryDateTime}>19/04/2025 - 08:46 </Text>
                    </View>
                    <View style={styles.entryCost}>
                        <Text style={styles.costText}>R$ 1500,00</Text>
                    </View>
                </View>

                <View style={styles.entry}>
                    <Ionicons name="wallet-outline" size={36} color={"black"} />
                    <View style={styles.entryTextContainer}>
                        <Text style={styles.entryTitle}>Serv. Garçom</Text>
                        <Text style={styles.entryDateTime}>07/04/2025 - 17:43 </Text>
                    </View>
                    <View style={styles.entryCost}>
                        <Text style={styles.costText}>R$ 250,00</Text>
                    </View>
                </View>

                <View style={styles.entry}>
                    <Ionicons name="wallet-outline" size={36} color={"black"} />
                    <View style={styles.entryTextContainer}>
                        <Text style={styles.entryTitle}>Iniciação Científica</Text>
                        <Text style={styles.entryDateTime}>06/04/2025 - 10:00 </Text>
                    </View>
                    <View style={styles.entryCost}>
                        <Text style={styles.costText}>R$ 700,00</Text>
                    </View>
                </View>

                <View style={styles.entry}>
                    <Ionicons name="wallet-outline" size={36} color={"black"} />
                    <View style={styles.entryTextContainer}>
                        <Text style={styles.entryTitle}>Mesada</Text>
                        <Text style={styles.entryDateTime}>02/04/2025 - 18:06 </Text>
                    </View>
                    <View style={styles.entryCost}>
                        <Text style={styles.costText}>R$ 100,00</Text>
                    </View>
                </View>
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
        width: 140,
        alignSelf: "center",
        borderWidth: 2,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 15,
        backgroundColor: "#fff",
    },
    placeholderStyle: {
        flex: 1,
        fontSize: 16,
        color: "#999",
    },
    selectedTextStyle: {
        flex: 1,
        fontSize: 16,
        color: "#333",
        textAlign: "center"
    },
    item: {
        padding: 17,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    textItem: {
        flex: 1,
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    icon: {
        marginRight: 6,
    },
    entryContainer: {
        marginTop: 50,
        flex: 1,
    },
    entry: {
        height: 70,
        flexDirection: "row",
        padding: 12,
        margin: 10,
        backgroundColor: "rgba(226, 255, 223, 1)",
        borderRadius: 10,
        alignItems: "center",
    },
    entryTextContainer: {
        flex: 1,
        justifyContent: "center",
        marginLeft: 8,
    },
    entryTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    entryDateTime: {
        fontSize: 14,
        color: "black",
        marginTop: 4,
    },
    entryCost: {
        height: 50,
        width: 100,
        alignItems: "flex-start",
        paddingTop: 15,
        paddingBottom: 15,
    },
    costText: {
        fontSize: 16,
    },
});
