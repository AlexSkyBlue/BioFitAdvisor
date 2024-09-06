import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Link } from '@react-navigation/native'; // Importa Link

const MenuItem = ({ title, icon, active, screen }) => {
  return (
    <>
      {screen  && screen !== "" ? (
              <Link asChild href={{ screen }}>
          <TouchableOpacity className="flex-row items-center mb-5">
            <FontAwesome5 
              name={icon} 
              size={20} 
              color={active ? '#E879F9' : 'gray'} 
            />
            <Text className={`ml-4 text-lg ${active ? 'text-[#E879F9]' : 'text-gray-400'}`}>
              {title}
            </Text>
          </TouchableOpacity>
        </Link>
      ) : (
        <TouchableOpacity className="flex-row items-center mb-5">
          <FontAwesome5 
            name={icon} 
            size={20} 
            color={active ? '#E879F9' : 'gray'} 
          />
          <Text className={`ml-4 text-lg ${active ? 'text-[#E879F9]' : 'text-gray-400'}`}>
            {title}
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
};

export default MenuItem;
