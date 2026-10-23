import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useApp, ScheduleItem } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';

export default function ScheduleScreen() {
  const { schedules, addSchedule, updateSchedule, deleteSchedule } = useApp();
  const [tab, setTab] = useState<'akademik' | 'non-akademik'>('akademik');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');

  const openAddModal = () => {
    setEditingId(null);
    setTitle('');
    setTime('');
    setLocation('');
    setModalVisible(true);
  };

  const openEditModal = (item: ScheduleItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setTime(item.time);
    setLocation(item.location);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!title.trim() || !time.trim() || !location.trim()) return;

    if (editingId) {
      await updateSchedule(editingId, { title, time, location, type: tab });
    } else {
      await addSchedule({ title, time, location, type: tab });
    }

    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Hapus Jadwal', 'Apakah kamu yakin ingin menghapus jadwal ini?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: () => deleteSchedule(id) },
    ]);
  };

  const filteredSchedules = schedules.filter((s) => s.type === tab);

  return (
    <SafeAreaView className="flex-1 bg-blue-50/40">
      {/* Header */}
      <View className="px-5 pt-4 pb-3 bg-white border-b border-blue-100 flex-row justify-between items-center">
        <View>
          <Text className="text-2xl font-bold text-slate-900">Jadwal Kampus</Text>
          <Text className="text-xs text-blue-600 font-medium mt-0.5">
            Kelola agenda kuliah & kegiatanmu
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
            onPress={() => setTab('akademik')}
            className={`flex-1 py-2.5 rounded-lg items-center ${
              tab === 'akademik' ? 'bg-white shadow-sm' : ''
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                tab === 'akademik' ? 'text-blue-600' : 'text-slate-500'
              }`}
            >
              📚 Akademik ({schedules.filter((s) => s.type === 'akademik').length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setTab('non-akademik')}
            className={`flex-1 py-2.5 rounded-lg items-center ${
              tab === 'non-akademik' ? 'bg-white shadow-sm' : ''
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                tab === 'non-akademik' ? 'text-blue-600' : 'text-slate-500'
              }`}
            >
              🎨 Non-Akademik ({schedules.filter((s) => s.type === 'non-akademik').length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* List Jadwal */}
      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        {filteredSchedules.length === 0 ? (
          <View className="p-8 items-center justify-center">
            <Text className="text-slate-400 text-sm">
              Belum ada jadwal {tab} tersimpan.
            </Text>
          </View>
        ) : (
          filteredSchedules.map((item) => (
            <View
              key={item.id}
              className="bg-white p-4 rounded-2xl mb-3 border border-blue-100 shadow-sm"
            >
              <View className="flex-row justify-between items-start mb-1">
                <Text className="text-base font-bold text-slate-900 flex-1 mr-2">
                  {item.title}
                </Text>
                <View className="flex-row gap-2 items-center">
                  <TouchableOpacity onPress={() => openEditModal(item)}>
                    <Ionicons name="pencil-outline" size={18} color="#2563EB" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>

              <Text className="text-xs text-blue-600 font-medium">⏰ {item.time}</Text>
              <Text className="text-xs text-slate-500 mt-1">📍 {item.location}</Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal Add/Edit */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white p-6 rounded-t-3xl border-t border-blue-100">
            <Text className="text-lg font-bold text-slate-900 mb-4">
              {editingId ? 'Edit Jadwal' : 'Tambah Jadwal'} ({tab})
            </Text>

            <TextInput
              placeholder="Nama Mata Kuliah / Kegiatan"
              value={title}
              onChangeText={setTitle}
              className="bg-blue-50/60 border border-blue-200 rounded-xl p-3 mb-3 text-sm"
            />
            <TextInput
              placeholder="Waktu (cth: 08:00 - 09:40 WIB)"
              value={time}
              onChangeText={setTime}
              className="bg-blue-50/60 border border-blue-200 rounded-xl p-3 mb-3 text-sm"
            />
            <TextInput
              placeholder="Lokasi (cth: Lab Komputer 2)"
              value={location}
              onChangeText={setLocation}
              className="bg-blue-50/60 border border-blue-200 rounded-xl p-3 mb-5 text-sm"
            />

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="flex-1 bg-slate-100 py-3 rounded-xl items-center"
              >
                <Text className="font-bold text-slate-600 text-sm">Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                className="flex-1 bg-blue-600 py-3 rounded-xl items-center"
              >
                <Text className="font-bold text-white text-sm">
                  {editingId ? 'Update' : 'Simpan'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}