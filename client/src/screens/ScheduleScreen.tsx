import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp, ScheduleItem } from "../context/AppContext";
import { Ionicons } from "@expo/vector-icons";

const HARI_LIST = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

export default function ScheduleScreen() {
  const { schedules, addSchedule, updateSchedule, deleteSchedule } = useApp();
  const [tab, setTab] = useState<"akademik" | "non-akademik">("akademik");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [hari, setHari] = useState("Senin");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [itemClass, setItemClass] = useState("");
  const [dosen, setDosen] = useState("");
  const [ruangan, setRuangan] = useState("");

  const openAddModal = () => {
    setEditingId(null);
    setName("");
    setHari("Senin");
    setStart("");
    setEnd("");
    setItemClass("");
    setDosen("");
    setRuangan("");
    setModalVisible(true);
  };

  const openEditModal = (item: ScheduleItem) => {
    setEditingId(item.id);
    setName(item.name);
    setHari(item.hari);
    setStart(item.start);
    setEnd(item.end);
    setItemClass(item.class);
    setDosen(item.dosen);
    setRuangan(item.ruangan);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!name.trim() || !start.trim() || !end.trim() || !ruangan.trim()) {
      Alert.alert(
        "Perhatian",
        "Nama, Jam Mulai, Selesai, dan Ruangan wajib diisi!",
      );
      return;
    }

    if (editingId) {
      await updateSchedule(editingId, {
        name,
        hari,
        start,
        end,
        class: itemClass,
        dosen,
        ruangan,
        type: tab,
      });
    } else {
      await addSchedule({
        name,
        hari,
        start,
        end,
        class: itemClass,
        dosen,
        ruangan,
        type: tab,
      });
    }

    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    if (Platform.OS === "web") {
      const confirmDelete = window.confirm(
        "Apakah kamu yakin ingin menghapus jadwal ini?",
      );
      if (confirmDelete) {
        deleteSchedule(id);
      }
    } else {
      Alert.alert("Hapus Jadwal", "Yakin ingin menghapus jadwal ini?", [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => deleteSchedule(id),
        },
      ]);
    }
  };

  const filteredSchedules = schedules.filter((s) => s.type === tab);

  return (
    <SafeAreaView className="flex-1 bg-blue-50/40">
      {/* Header */}
      <View className="px-5 pt-4 pb-3 bg-white border-b border-blue-100 flex-row justify-between items-center">
        <View>
          <Text className="text-2xl font-bold text-slate-900">
            Jadwal Kampus
          </Text>
          <Text className="text-xs text-blue-600 font-medium mt-0.5">
            Siap terhubung ke alarm pengingat
          </Text>
        </View>
        <TouchableOpacity
          onPress={openAddModal}
          className="bg-blue-600 px-3.5 py-2 rounded-xl active:bg-blue-700"
        >
          <Text className="text-white font-bold text-xs">+ Tambah</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Switcher */}
      <View className="p-4 bg-white border-b border-blue-100">
        <View className="flex-row bg-blue-50 p-1 rounded-xl">
          <TouchableOpacity
            onPress={() => setTab("akademik")}
            className={`flex-1 py-2.5 rounded-lg items-center ${
              tab === "akademik" ? "bg-white shadow-sm" : ""
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                tab === "akademik" ? "text-blue-600" : "text-slate-500"
              }`}
            >
              📚 Akademik (
              {schedules.filter((s) => s.type === "akademik").length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setTab("non-akademik")}
            className={`flex-1 py-2.5 rounded-lg items-center ${
              tab === "non-akademik" ? "bg-white shadow-sm" : ""
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                tab === "non-akademik" ? "text-blue-600" : "text-slate-500"
              }`}
            >
              🎨 Non-Akademik (
              {schedules.filter((s) => s.type === "non-akademik").length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* List Jadwal */}
      <ScrollView
        className="flex-1 px-5 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {filteredSchedules.length === 0 ? (
          <View className="p-8 items-center justify-center">
            <Text className="text-slate-400 text-sm">
              Belum ada jadwal tersimpan.
            </Text>
          </View>
        ) : (
          filteredSchedules.map((item) => (
            <View
              key={item.id}
              className="bg-white p-4 rounded-2xl mb-3 border border-blue-100 shadow-sm"
            >
              <View className="flex-row justify-between items-start mb-1">
                <View className="flex-1 mr-2">
                  <Text className="text-base font-bold text-slate-900">
                    {item.name}
                  </Text>
                  {item.class ? (
                    <Text className="text-xs font-semibold text-blue-600">
                      Kelas: {item.class}
                    </Text>
                  ) : null}
                </View>
                <View className="flex-row gap-2 items-center">
                  <TouchableOpacity onPress={() => openEditModal(item)}>
                    <Ionicons name="pencil-outline" size={18} color="#2563EB" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="mt-2 pt-2 border-t border-slate-100 flex-row justify-between items-center">
                <Text className="text-xs text-slate-700 font-bold">
                  🗓 {item.hari}, {item.start} - {item.end}
                </Text>
                <Text className="text-xs text-slate-500">
                  📍 {item.ruangan}
                </Text>
              </View>

              {item.dosen ? (
                <Text className="text-xs text-slate-500 mt-1">
                  👨‍🏫 Dosen: {item.dosen}
                </Text>
              ) : null}

              <View className="mt-2 flex-row justify-between items-center">
                <Text className="text-[10px] text-slate-400">
                  Dibuat jam {item.jamDibuat}
                </Text>
                <View className="flex-row items-center bg-blue-50 px-2 py-0.5 rounded-full">
                  <Ionicons name="alarm-outline" size={12} color="#2563EB" />
                  <Text className="text-[10px] text-blue-600 font-bold ml-1">
                    Alarm Ready
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal Add / Edit Schedule */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <View className="flex-1 justify-end bg-black/40">
            <View className="bg-white p-6 rounded-t-3xl border-t border-blue-100 max-h-[85%]">
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <Text className="text-lg font-bold text-slate-900 mb-4">
                  {editingId ? "Edit Jadwal" : "Tambah Jadwal"} ({tab})
                </Text>

                <Text className="text-xs font-semibold text-slate-600 mb-1">
                  Mata Kuliah / Kegiatan
                </Text>
                <TextInput
                  placeholder="cth: Pemrograman Mobile"
                  value={name}
                  onChangeText={setName}
                  className="bg-blue-50/60 border border-blue-200 rounded-xl p-3 mb-3 text-sm"
                />

                <Text className="text-xs font-semibold text-slate-600 mb-1">
                  Hari
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="flex-row gap-2 mb-3"
                >
                  {HARI_LIST.map((h) => (
                    <TouchableOpacity
                      key={h}
                      onPress={() => setHari(h)}
                      className={`px-3 py-1.5 rounded-xl border ${
                        hari === h
                          ? "bg-blue-600 border-blue-600"
                          : "bg-white border-blue-200"
                      }`}
                    >
                      <Text
                        className={`text-xs font-bold ${hari === h ? "text-white" : "text-slate-600"}`}
                      >
                        {h}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <View className="flex-row gap-2 mb-3">
                  <View className="flex-1">
                    <Text className="text-xs font-semibold text-slate-600 mb-1">
                      Jam Mulai
                    </Text>
                    <TextInput
                      placeholder="08:00"
                      value={start}
                      onChangeText={setStart}
                      className="bg-blue-50/60 border border-blue-200 rounded-xl p-3 text-sm"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs font-semibold text-slate-600 mb-1">
                      Jam Selesai
                    </Text>
                    <TextInput
                      placeholder="09:40"
                      value={end}
                      onChangeText={setEnd}
                      className="bg-blue-50/60 border border-blue-200 rounded-xl p-3 text-sm"
                    />
                  </View>
                </View>

                <Text className="text-xs font-semibold text-slate-600 mb-1">
                  Kelas
                </Text>
                <TextInput
                  placeholder="cth: TI-3A"
                  value={itemClass}
                  onChangeText={setItemClass}
                  className="bg-blue-50/60 border border-blue-200 rounded-xl p-3 mb-3 text-sm"
                />

                <Text className="text-xs font-semibold text-slate-600 mb-1">
                  Dosen Pengampu
                </Text>
                <TextInput
                  placeholder="cth: Dr. Budi Santoso"
                  value={dosen}
                  onChangeText={setDosen}
                  className="bg-blue-50/60 border border-blue-200 rounded-xl p-3 mb-3 text-sm"
                />

                <Text className="text-xs font-semibold text-slate-600 mb-1">
                  Ruangan
                </Text>
                <TextInput
                  placeholder="cth: Lab Komputer 2"
                  value={ruangan}
                  onChangeText={setRuangan}
                  className="bg-blue-50/60 border border-blue-200 rounded-xl p-3 mb-5 text-sm"
                />

                <View className="flex-row gap-3 mb-6">
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    className="flex-1 bg-slate-100 py-3 rounded-xl items-center"
                  >
                    <Text className="font-bold text-slate-600 text-sm">
                      Batal
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSave}
                    className="flex-1 bg-blue-600 py-3 rounded-xl items-center"
                  >
                    <Text className="font-bold text-white text-sm">
                      {editingId ? "Update" : "Simpan"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
