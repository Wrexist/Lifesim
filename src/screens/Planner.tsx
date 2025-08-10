import { View, Text, Pressable, ScrollView } from 'react-native';
import { useGame } from '../store';
import Background from '../components/Background';
import HUD from '../components/HUD';
import ActivityCard from '../components/ActivityCard';

const icons = {
  WORK:      require('../../assets/work.png'),
  STUDY:     require('../../assets/study.png'),
  GYM:       require('../../assets/gym.png'),
  SIDE_JOB:  require('../../assets/sidejob.png'),
  BUSINESS:  require('../../assets/business.png'),
  DARKWEB:   require('../../assets/darkweb.png'),
  DATE:      require('../../assets/date.png'),
  REST:      require('../../assets/rest.png'),
};

export default function PlannerScreen() {
  const {
    doWork,
    doStudy,
    doGym,
    doSideJob,
    doBusiness,
    doDarkweb,
    doDate,
    doRest,
    nextWeek,
    prisonWeeksLeft,
    jobs,
  } = useGame();

  const mainJobId = jobs.find(j => !j.street)?.id ?? jobs[0]?.id;
  const sideJobId = jobs.find(j => j.street)?.id ?? jobs[0]?.id;

  const actions = [
    { key: 'WORK',     sub: 'Energi −8 • +💰',       onPress: () => doWork(mainJobId),     icon: icons.WORK },
    { key: 'STUDY',    sub: 'Energi −5 • +Färdighet',onPress: doStudy,    icon: icons.STUDY },
    { key: 'GYM',      sub: 'Energi −7 • 😊 +1',     onPress: doGym,      icon: icons.GYM },
    { key: 'SIDE_JOB', sub: 'Energi −6 • +Lite 💰',  onPress: () => doSideJob(sideJobId),  icon: icons.SIDE_JOB },
    { key: 'BUSINESS', sub: 'Energi −6 • Bolag ↑',   onPress: doBusiness, icon: icons.BUSINESS },
    { key: 'DARKWEB',  sub: 'Energi −10 • Risk ↑',   onPress: doDarkweb,  icon: icons.DARKWEB },
    { key: 'DATE',     sub: 'Energi −4 • 😊 +2',     onPress: doDate,     icon: icons.DATE },
    { key: 'REST',     sub: 'Energi +10 • 😊 +1',    onPress: doRest,     icon: icons.REST },
  ] as const;

  return (
    <View style={{ flex:1 }}>
      <Background />
      <HUD />

      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 120 }}>
        <Text style={{ fontSize: 20, fontWeight:'800', color:'#fff', textShadowColor:'#000', textShadowRadius:4, marginBottom:8 }}>
          Välj aktivitet (direkt)
        </Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {actions.map(a => (
            <ActivityCard
              key={a.key}
              title={a.key}
              subtitle={a.sub}
              icon={a.icon}
              onPress={a.onPress}
            />
          ))}
        </View>

        {prisonWeeksLeft > 0 && (
          <Text style={{ textAlign:'center', color:'#fff', marginTop:12 }}>
            🚨 Fängelse: {prisonWeeksLeft} veckor kvar.
          </Text>
        )}

        <Pressable
          onPress={nextWeek}
          style={{
            marginTop:16, alignSelf:'center',
            paddingVertical:12, paddingHorizontal:20,
            borderRadius:12, borderWidth:1,
            backgroundColor:'#16a34a' // grön
          }}
        >
          <Text style={{ color:'#fff', fontWeight:'800' }}>NEXT WEEK ▶</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
