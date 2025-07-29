import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
    categoryDropdown: {
        height: 50,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 15,
        backgroundColor: "#fff",
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
    categoryPlaceholderStyle: {
        fontSize: 16,
        color: "#999",
    },
    categorySelectedTextStyle: {
        fontSize: 16,
        color: "#333",
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