
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';



export default function Modal({ children, snapPoints = [10, 300], ref, onClose, ...props }) {
    return (
        <BottomSheet
            {...props}
            ref={ref}
            snapPoints={snapPoints}
        >
            <BottomSheetScrollView>
                {children}  
            </BottomSheetScrollView>
        </BottomSheet>
    )
}