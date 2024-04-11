import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Spacing from '../constants/Spacing';
import FontSize from '../constants/FontSize';
import Colors from '../constants/Colors';
import Font from '../constants/Font';
import { useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import axios from 'axios';

type Props = NativeStackScreenProps<RootStackParamList, 'DataScreen'> & {
  route: RouteProp<RootStackParamList, 'DataScreen'>;
}

interface LineOption {
  LINE_ID: string;
  LINE_NAME: string;
}

interface MachineOption {
  MBA_NO: string;
  MBA_NAME: string;
}
interface InstantData {
  MBA_NO: string;
  Data: string;
}
const DataScreen: React.FC<Props> = ({ navigation, route }) => {
  const { userId, token } = route?.params;
  const [lineId, setLineId] = useState('');
  const [showStationOptions, setShowStationOptions] = useState(false);
  const [selectedStationOption, setSelectedStationOption] = useState<LineOption | null>(null);
  const [lineOptions, setLineOptions] = useState<LineOption[]>([]);
  const [selectedLineOption, setSelectedLineOption] = useState<LineOption | null>(null);
  const [machineOptions, setMachineOptions] = useState<MachineOption[]>([]);
  const [selectedMachineOption, setSelectedMachineOption] = useState('');
  const [MBANo,setMBANo] = useState ('');
  const [instantData, setInstantData] = useState<InstantData | null>(null);

  const handleStationOptionsPress = () => {
    setShowStationOptions(!showStationOptions);
  };

  const handleStationOptionPress = (option: LineOption) => {
    setSelectedStationOption(option);
    setSelectedLineOption(null);
    setSelectedMachineOption('');
    setShowStationOptions(false);
  };

  const handleLineOptionsPress = (option: LineOption) => {
    setSelectedLineOption(option);
    setSelectedMachineOption('');
  };

  const handleMachineOptionPress = (option: string) => {
    setSelectedMachineOption(option);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiURL = `http://14.225.244.63:4040/api/GetLineList?UserID=${userId}&Token=${token}`;
        const response = await axios.get(apiURL);
        const data: LineOption[] = response.data;
        const lineId = data[0].LINE_ID;
        setLineId(lineId);
        setLineOptions(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [userId, token]);

  useEffect(() => {
    const fetchMachineData = async () => {
      try {
        if (selectedLineOption) {
          const apiURL = `http://14.225.244.63:4040/api/GetMBAListByLine?LineID=${lineId}&DateMiss=&Token=${token}`;
          const response = await axios.get(apiURL);
          const data: MachineOption[] = response.data;
          const MBANo = data[0].MBA_NO;
          setMBANo(MBANo); 
          setMachineOptions(data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchMachineData();
  }, [selectedLineOption, token]);


  
  useEffect(() => {
    const fetchInstantData = async () => {
      try {
        if (selectedMachineOption) {
          const apiURL = `http://14.225.244.63:4040/api/GetLatestInstant?MBANo=${selectedMachineOption}`;
          const response = await axios.get(apiURL);
          const data: InstantData = response.data;
          setInstantData(data);
          console.log(data);
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchInstantData();
  }, [selectedMachineOption]);

  return (
    <SafeAreaView>
      <View
        style={{
          padding: Spacing * 2,
        }}
      >
        <View
          style={{
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: FontSize.xLarge,
              color: Colors.primary,
              fontFamily: Font['poppins-bold'],
              marginVertical: Spacing * 3,
            }}
          >
            Dữ liệu MBA
          </Text>
        </View>

        <View style={styles.content}>
          <TouchableOpacity onPress={handleStationOptionsPress}>
            <Text style={styles.name}>Chọn trạm biến áp</Text>
          </TouchableOpacity>
          {showStationOptions && (
            <View>
              {lineOptions.map((line: LineOption) => (
                <TouchableOpacity
                  key={line.LINE_ID}
                  onPress={() => handleStationOptionPress(line)}
                >
                  <Text style={styles.option}>{line.LINE_NAME}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {selectedStationOption && (
          <View style={styles.content}>
            <TouchableOpacity onPress={handleLineOptionsPress}>
              <Text style={styles.name}>Chọn máy biến áp</Text>
            </TouchableOpacity>
            {selectedLineOption && (
              <View>
                {machineOptions.map((machine: MachineOption) => (
                  <TouchableOpacity
                    key={machine.MBA_NO}
                    onPress={() => handleMachineOptionPress(machine.MBA_NAME)}
                  >
                    <Text style={styles.option}>{machine.MBA_NAME}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing * 2,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing * 3,
  },
  title: {
    fontSize: FontSize.xLarge,
    color: Colors.primary,
    fontFamily: Font['poppins-bold'],
  },
  content: {
    alignItems: 'center',
    backgroundColor: Colors.lightBlue,
    borderRadius: 10,
    padding: Spacing * 2,
  },
  name: {
    fontSize: FontSize.large,
    color: Colors.primary,
    fontFamily: Font['poppins-bold'],
    marginVertical: Spacing,
  },
  option: {
    fontSize: FontSize.medium,
    color: Colors.lightBlue,
    fontFamily: Font['poppins-regular'],
    marginVertical: Spacing,
  },
});

export default DataScreen;