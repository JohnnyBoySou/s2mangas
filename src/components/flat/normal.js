import { Column, Row, } from '@theme/global';
import { FlatList } from 'react-native';
import { Skeleton } from 'moti/skeleton'
import Card from '@components/lists/card';

export default function FlatComponent({ data }) {
    return (
        <FlatList
            style={{ marginVertical: 16,  }}
            data={data}
            ListHeaderComponent={<Column style={{ width: 20, }} />}
            ListEmptyComponent={<Loading />}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <Card item={item} />}
            horizontal
            windowSize={3}
            initialNumToRender={3}
            removeClippedSubviews
            maxToRenderPerBatch={3}
            updateCellsBatchingPeriod={100}
            showsHorizontalScrollIndicator={false}
        />
    );
}

const Loading = () => {
    return (
        <Row>
            <Column style={{ backgroundColor: "#303030", borderRadius: 6, width: 204, marginRight: 16, padding: 12, paddingBottom: 20, alignItems: 'center', }}>
                <Skeleton colorMode='dark' width={152} height={152} style={{ alignSelf: 'center', }} radius={6} />
                <Spacer height={10} />
                <Skeleton colorMode='dark' width={160} height={26} radius={4} />
                <Spacer height={6} />
                <Skeleton colorMode='dark' width={120} height={16} radius={4} />
            </Column>
            <Column style={{ backgroundColor: "#303030", borderRadius: 6, width: 204, marginRight: 16, padding: 12, paddingBottom: 20, alignItems: 'center', }}>
                <Skeleton colorMode='dark' width={152} height={152} style={{ alignSelf: 'center', }} radius={6} />
                <Spacer height={10} />
                <Skeleton colorMode='dark' width={160} height={26} radius={4} />
                <Spacer height={6} />
                <Skeleton colorMode='dark' width={120} height={16} radius={4} />
            </Column>
            <Column style={{ backgroundColor: "#303030", borderRadius: 6, width: 204, marginRight: 16, padding: 12, paddingBottom: 20, alignItems: 'center', }}>
                <Skeleton colorMode='dark' width={152} height={152} style={{ alignSelf: 'center', }} radius={6} />
                <Spacer height={10} />
                <Skeleton colorMode='dark' width={160} height={26} radius={4} />
                <Spacer height={6} />
                <Skeleton colorMode='dark' width={120} height={16} radius={4} />
            </Column>
        </Row>
    )
}
const Spacer = ({ height = 16 }) => <Column style={{ height }} />

