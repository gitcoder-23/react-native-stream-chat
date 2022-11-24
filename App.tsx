import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StreamChat } from 'stream-chat';
import { ChannelList, Chat, OverlayProvider } from 'stream-chat-expo';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

const STREAM_API_KEY = 'tte924r6jax7';
const STREAM_API_ID = '1221070';
const STREAM_API_SECRET =
  'pj6f8fgz6mfpjz8ykra6zts2x7bhrkem64bg94zwbajvzbfzthj865h8ftehykkm';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  // test static
  const staticUser = {
    id: 'john',
    name: 'John Doe',
    image: 'https://getstream.io/random_svg/?name=John',
  };

  const chatClient = StreamChat.getInstance(STREAM_API_KEY, {
    timeout: 6000,
  });

  useEffect(() => {
    const connectUserAuth = async () => {
      //  Testing

      await chatClient.connectUser(
        staticUser,
        // token for development(stop authcheck from Stream)
        chatClient.devToken(staticUser.id)

        // Token is user token after login needed for production (Start authcheck from Stream)
        // 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiY3VybHktZm9nLTUifQ.znj_52YL-ixDsJ9CcjEmkCKRJH2yQ5M5djdJrTkppeg'
      );

      // create channel
      const channel = chatClient.channel('messaging', 'developer-talk', {
        image:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/2300px-React-icon.svg.png',
        name: 'Talk With Developers',
        members: [staticUser.id],
      });
      console.log('channel->', channel);
      await channel.watch();
    };

    connectUserAuth();

    // when leave your app need unmount the app
    return () => {
      chatClient.disconnectUser();
    };
  }, []);

  const filters = {
    type: 'messaging',
    members: { $in: [staticUser.id] },
    frozen: false,
  };

  const sort = { last_message_at: -1 };

  const options = { limit: 20, messages_limit: 30 };

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <StatusBar />
        <OverlayProvider>
          <Chat client={chatClient}>
            <ChannelList filters={filters} />
          </Chat>
        </OverlayProvider>
      </SafeAreaProvider>
    );
  }
}
