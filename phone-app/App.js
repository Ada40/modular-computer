import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { Cpu, Code, Settings, Zap, RefreshCw, Plus, ShieldCheck } from 'lucide-react-native';
import { ModularComputerProvisioner } from './Provisioner';

const provisioner = new ModularComputerProvisioner();

const ModuleCard = ({ id, type, status, onConnect, provisioning }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Cpu color="#0f766e" size={24} />
      <Text style={styles.cardTitle}>{id}</Text>
    </View>
    <Text style={styles.cardSubtitle}>Type: {type}</Text>
    <View style={styles.statusBadge}>
      <View style={[styles.statusDot, { backgroundColor: status === 'Connected' ? '#10b981' : '#f59e0b' }]} />
      <Text style={styles.statusText}>{status}</Text>
    </View>
    <TouchableOpacity 
      style={[styles.button, status === 'Connected' && styles.buttonConnected]} 
      onPress={onConnect}
      disabled={provisioning}
    >
      {provisioning ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text style={styles.buttonText}>{status === 'Connected' ? 'Open IDE' : 'Connect & Provision'}</Text>
      )}
    </TouchableOpacity>
  </View>
);

export default function App() {
  const [modules, setModules] = useState([
    { id: 'ESP32-CORE-001', type: 'Compute', status: 'Disconnected' }
  ]);
  const [isProvisioning, setIsProvisioning] = useState(false);

  const handleConnect = async (id) => {
    const module = modules.find(m => m.id === id);
    if (module.status === 'Connected') {
      // Open IDE logic
      alert('Opening IDE for ' + id);
      return;
    }

    setIsProvisioning(true);
    try {
      const device = await provisioner.discoverESP32();
      if (device) {
        const needs = await provisioner.getNeedsList(device);
        await provisioner.provisionModules(device, needs);
        setModules(modules.map(m => m.id === id ? { ...m, status: 'Connected' } : m));
      }
    } catch (error) {
      console.error(error);
      alert('Provisioning failed');
    } finally {
      setIsProvisioning(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Modular Computer</Text>
          <ShieldCheck color="#0f766e" size={24} />
        </View>
        <Text style={styles.headerSubtitle}>by Adam Lee Hatchett</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Modules</Text>
            <TouchableOpacity>
              <RefreshCw color="#64748b" size={20} />
            </TouchableOpacity>
          </View>
          
          {modules.map(module => (
            <ModuleCard 
              key={module.id} 
              {...module} 
              provisioning={isProvisioning}
              onConnect={() => handleConnect(module.id)} 
            />
          ))}

          <TouchableOpacity style={styles.addCard}>
            <Plus color="#94a3b8" size={32} />
            <Text style={styles.addText}>Add New Module</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.grid}>
            <TouchableOpacity style={styles.actionItem}>
              <View style={[styles.iconCircle, { backgroundColor: '#f0fdfa' }]}>
                <Code color="#0f766e" size={24} />
              </View>
              <Text style={styles.actionLabel}>IDE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem}>
              <View style={[styles.iconCircle, { backgroundColor: '#fff7ed' }]}>
                <Zap color="#f97316" size={24} />
              </View>
              <Text style={styles.actionLabel}>Flash</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem}>
              <View style={[styles.iconCircle, { backgroundColor: '#f8fafc' }]}>
                <Settings color="#64748b" size={24} />
              </View>
              <Text style={styles.actionLabel}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2026 Adam Lee Hatchett • Hampton Roads</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginLeft: 12,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#475569',
  },
  button: {
    backgroundColor: '#0f766e',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  buttonConnected: {
    backgroundColor: '#64748b',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  addCard: {
    height: 120,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(241, 245, 249, 0.5)',
  },
  addText: {
    marginTop: 8,
    color: '#94a3b8',
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionItem: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#fff',
  },
  footerText: {
    fontSize: 12,
    color: '#94a3b8',
  },
});
