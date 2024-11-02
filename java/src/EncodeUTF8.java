public class EncodeUTF8 {
    public static void main(String[] args) {
        //「あ」のEndodeの16進数
        int codePoint = 0x3042;

        System.out.println(Integer.toHexString(codePoint));

        encode(codePoint);
    }
    private static void encode(int codePoint){
        int[] utf8Bytes = {224,128,128};
        int tmp = codePoint;
        for(int i = utf8Bytes.length -1 ; i>=0;i--){
            utf8Bytes[i] =  utf8Bytes[i]+ (tmp%64);
            tmp = tmp/64;
        }
        System.out.println(utf8Bytes[0]+","+utf8Bytes[1]+","+utf8Bytes[2]);
    }
}
