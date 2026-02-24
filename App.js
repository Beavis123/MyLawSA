/**
 * SAPS AccidentStatement — A MyLawSA Product
 * Expo Go compatible — single App.js
 * Colours: Red · Yellow · Green
 */

import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet,
  Modal, FlatList, Alert, Platform, StatusBar, Dimensions, Image,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

// ─────────────────────────────────────────────────────────────────
// COMPANY LOGO (base64 embedded)
// ─────────────────────────────────────────────────────────────────
const LOGO_B64 = 'data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAGOAYkDASIAAhEBAxEB/8QAHAABAAICAwEAAAAAAAAAAAAAAAEHAgYDBQgE/8QARhAAAgEDAgMFBQMGDAYDAAAAAAECAwQRBQYhMUEHElFhcRMUIoGRMkLRCEVygqGxFSMkM1Jig4SSweHiQ0Rz0vDxRlST/8QAGwEBAAIDAQEAAAAAAAAAAAAAAAEGAgQFAwf/xAAsEQEAAgIBBAIBAwQDAQEAAAAAAQIDBBEFEiExE0FRFDJhBiJCUhWBkXEj/9oADAMBAAIRAxEAPwD2WAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABjnyMjHrjARMT9JBi5cccPPyIjJvj3o4JOfzLPLGWY58xlf0kODx+WXyHyMcvxwTnzI4Tz/KRkhPPVDLHCP8AtORw8yMsZf8A4hxwn/tPDzHAjP8A5gklB8x8yPmMrxRB4ZAxz5k5fkEpATAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbwQ3hZCBvHM6vcmt2GgaTW1PUq8aNCnHLb5t9EvFk7i1vT9A0mtqWp3EaNCksty5vyS5t+SPJPanv7Ud66u5udShp1Jv3e3zwXm/GRMVlqbWzXFX+Xab27XNz6xrVStpOoVtOsYz/iqdOXFpdW/M6en2mb6h/8jvH6tYNQXBA9opDgW2Mlp55brDtU35H8/wBdrzSOaHa1vuP55m/WJogJ7YR8+T8t/XbBvtfnVP1gckO2XfcfzhRfrT/1K8A7YZfqcv5WRDtr35H/AJu0frQf4nLDtw3zF59tYy9aD/ErIDtg/VZfytOHbtvdc1pr/u7/AO454dve8V9q302X9k/xKlA7YTG3mj7XBHt+3UvtWOnv0g/xOSP5QG4l9rTLF/UpsEdkJ/WZv9l0w/KB1tPMtHtH6SaOWP5Qmqr7Wh27/tX+BSIHZCf1ub8rzj+UPffe27Rf94/2nLD8oqrHhLbUX6Xf+0ofKzx4evAc+XEdtWX6/N/s9AUvyi6b/nNry+V3/sOaP5RNn97bdRf3n/aeeFlPi4r1Z3W3Nra/uCtGnpWlVrjvPHf7rjBfrPgRNasq72zaeIXovyh9Myu9oNePk63H9x9Ft2/6VXqQp09CvJym8RjCXeb/AGHQ7Q7AbmSjW3FqXs4vi7ag849WXBtXZO3Ns08aVplCnUa+KtJd6o/1nxMJ44dDDG1f91uHFtrdl5q3cqXO37vTaE8dydzJJyz4I2mEnLpg1Pel57vXtaUMYjP2kuPFYNm0+oq1rCovvRT4nPw7dcme+OJ9OzOtfHgpe0+30AA3XiAAAAAAAAAAAAAAAAAAAAAAAAAAAAQ1h5ASwuJ1e5tc07b2k1tS1S5jRoUo5bb5vkkvNvgRuXXNP29pNXUtUrwoUaSbbb4t+CXVnkrtR37qG9dWlUqSdGwpSfu9vnkvF/1iaxzLU2tmuKvH2y7Ud/alvTVJTnN0dNpycaFCL5Lxfi2aWAbPiIVu97ZLd1gABiAAIAAAAAAADg8gBEumOfTDwQd0f9pB3O3dr7g3BVjT0nTLm4beHNQ7sfm3zLe2h2BVZ9y43LqEKSks+7Wybfzm8YImeGxi1cuX9sKJoUqtepCjRp1Kk5vEYxj3pMsTaXY7u3Xe5Vq26063lh+0uFhtfo8MnpHauyNt7appaXpdGlPrVlFOb+ZssMd3HA8u508PTaR+5VmzOxXbOjqFfUVU1K5WMqpwpp+Uef1bLKsbK1sqSo2lvRo01wUacFFL1PqSJMZnl0seGmOOKww5NceLMZSwuPhk5T49SqxoWdarJ4UYM8727Kzafp70jm0K/wB13XvOr1nn4U1GPlwNv2Vde8aPGLeZU33WV9Wl7SpKo+cpNmy7EuvZ31W2lyqQyvVf+yh9L3pjqE3n/Kf/ABZd7Xj9FER9N5BxxbeG+qM+hfpnzCrpABKQAAAAAAAAAAAAAAAAAAAAAAIb+gDK8cZOp3Rr2n7d0itqmp140bekstt8W/BeLZG5tf03bukV9S1KvGjRox6vi30S8TyV2nb71LeurSqVqkqVhTl/J6ClwS8X5/uMqRy09vZrhrxE+U9p+/NR3rq8q1SVSjYU21Qt0+CXi/F/uNOwsJY5ch18uiB79sQrl8tss91gAEsQABAAAAAXo2+iSyOE8Afo36CKcuCXxeB3O3dra/uKqqWkabWueOHJJqMfVkemVaWtPEQ6XL5LD+TbOShSq16saVKDnUk8RiuvoXnszsCr1JQudy6j7JNZ93t+L+cn+BcW2djbZ29SUNM0yjTmudWSUpv5mPyRHpvYem5L+beHmzaPY/uzXlGrWtnpltLj7S5i4yx5JlxbO7FdraM4XGoxlqtwsPNV/An5JYz8y1FFJYQUWuvEwnJMurh0sWPzMcy+ews7SzoqjaW1KhTXKNOCil9D6HFEpcc5JPOZltxER68Ix5DGOSwSGAQI5E5EyQM1zfFy6OlOmnxqPHyNiyaHvu69pqMKCfw04Za82cfrmecOnaY9t/p2P5M8ctdXI+3R7n3XUaNZvCUsP0Z8aWCF9pZ8T53jy/Hli8Lhlxxek1+ltU5d5RaeepyHWbbuFdaTQq5y+73X8jtMH1bBkjJiraFDyV7LzEgAPZiAAAAAAAAAAAAAAAAAAAGCHzAS8DqN06/pu3dJranqdxGlRprq+Mn4JdX6Ebr3Bpu29GranqldUqNNcs8ZPkkvNs8ldp2+tS3prDrV5OlY0pYt7VPGF4vzM6V5aW3txgg7UN96nvbV3WquVGwpv+T22eEfN+LNQ/YAesV4V7JktknmQAGTAAAQB/MBLMljOf2ESefoyvFfUN45ncbc2vr24q6p6TptxcccOShiC9WW5tHsBuakoVtx6gqUHzo2yzNfrPK/YY9z3x62XJ6hR1ClVuKqpUKc6tRvChCPef0RYGz+x/duvuNatbLTraX/ABK/CWP0ef7D0ntnY+2tu0oR07TKEZx51ake9N/M2OKxhZwY2u6eHpda/ulVu0OxHbGkuFfUoy1SvHDxW400/wBHr8yzbOzt7OjGhbUKdGlFYjCnFRjH0SOePIkw7pl0seCmOOKwwcX0SOQgkxe3MgAAAAAAAIk8NB8FkPmRLqgTJJqMW34FWavcK61GvX5qc2vl0LA3Dcu10u4qJ8fZtR9StZFM/qjYm3bir/KwdEwxM2vKc5HRtLLBC45S8CoRXxx+Hf8APluPZ/dfxde1b4QlmPobbkrbad27fWKSz8M+D+hY+fxPov8AT+zObW8/SpdVwfFn/wDrMBA7rmgAAAAAAAAAAAAAAAABjxS5r1YBpLLzjxOo3ZuDTdt6PV1PUq6pU6aeIt8ZvwRG7dw6ZtnR62q6pcRpUKaylnjN9EvFnkrtL3zqW89YnXrylSs4Nqhbp/DFeL8zKKctLZ264azEe0dpm+tS3rrMq9w3Ssab/k1tn7C8X5mpDHHPUHtWOFeyZJyW5kAIb9V68mZPNII7zf3W/wBFM7jbm2dc3DWVPSNOr3Sbw5U4OUY/pNcEPHDKtJvPFYdQZ0aFWvUjToUpVKknhQim39C8No9gV3WcK+49RjQi1n2FDjL5t5Lh2tsXa+3aUY6dpNuqi51Zx78vrLLRh3RHpv4umZr+bz4ea9odke7twd2rO1Vhavj7W6fd4eUVlv54Ll2h2JbY0pQrakparcLDffj3aaf6JasYxS4LBKS6HnNuXUxaOKn15fNYWdrZ0YULO3p0aUeChCPdSPqwEiTBt1rFfQAAyAAAAAAAAAAAAAGMvtIhr4WZMhvCyQjj6arv65ULWjbx5yeWvI007fd907jWKkVLMaWI/I6g+Z9Z2Iz7drR/8XLpuL4teIAAcpvpt5ulWhUjzjJP9paen1lcWlKqmviivqVU+Bveybn2+mKm3xhL9haf6a2Ypmmk/wCTi9aw91YyfhsgCBeVZAAAAAAAAAAAAAAP0DfEhyWOaYQd7jjDOm3ZuHTtt6PW1PU68adOnF92OeM30SRG79yabtnR6up6nWVOlBfDHPGT8Eup5I7St76lvPWZXd3OVG3pv+TW+cKC8X4szrSZau1t1w1/ll2k751LeesO5uJunaU5YoUE/hjHxfn1NSSwseYTzx4vxCafVL1PescK1fLbLbumORvCHmk0vFrCO429tfXtwVo0tK0y4uO88d/uYgv1nwLd2j2A3NRRrbh1BUU1n2Nu+K9XyIm0PfHr5MnqFHUqVWtUjClTnNzeIqKy2b9tDsh3dr0o1KlqtPtp8fa1+ePJHpPauw9s7ZpRWk6XRp1lzrzip1X+u+JsvdaXA87X/DpYemRH75Vbs7sR2tpHcr6j7TVLmOH/ABvCGf0f9SzLGwtLGiqNpb0qFNLCjCKSRzwi0231Mjzm0y6VMGPHHFYR3VyGCQQ9QjBIAYAAAAAAAAAAAAAAAAAAESOC7qKla1Kj5Ri2c8uR0m8blUNIqRTw5/CjX2ssYcU3n8PTDT5MkVaBdVfa3FSo+LnJtmBCSS88Enyi090zafuZXqkdtYgIbJBgzhEuRsGx7n2eqSouXw1KfBeaOgPo0y492vaFdcO5NfTqbvT9j4NutvqGrt4/lwTWFrZ4AwpzUqcZJ5TWTLJ9TieY7vpSJhKBCJMgAAAAAAAAAMWuL4/6ATPjwOl3duPTNsaPV1LUq0adOEcxj96T6JEbu3Jpm2tFq6lqddUqcI/DFv4pvwSPMG573efalrqrWunXk7eMmqFGKxTpx8cvrjn8zOlOfLV2dj444rHMun7SN7alvPV53VzUlC0jJxt7bOFTXi/M1elSq16kKNGnUqTm8RjGPeky89n9gNefcuNyahTpqXH3a3Tk/nN4wXDtXY+2NswS0vTKNOp1qyjmb+Zna/b4cuujlzT3Xl5s2n2P7u1zu1KtutOt5YftLlYbX6PDJcmzexTbGkKFfUvaalcrGVPhTT8o8/q2WmkkuSJXIwm/Lo4dKmP2+axsbSxpKjZ29GhSXBRpwSR9OPB5HyHyMPLcjivpPAEfIfIeTmEokx+Q4knMMgYjPkQlkDHPkM+TAyBjnyY5gZAxRIRykEIkJAAAAAAAAAABEuZpW/rjvXFG3T4R+Jm6VMJZZWW4Lh3Oq16meCqOK9FwRXv6k2Pj1Zxx7s6nSMXfn5n6deiQD59/C2c8yAAAQuBIJieIRx44WHte7dzpNGUn8UF3JeqO3zwRqWwLpZr2s3170fQ26Kxk+ndKzfPp0mfalb2L4801hkiSESdNqgAAAAAAABhLL7yXdzzX+pmRKOerXoBT/aRZ3FtrEtX1zb1bXLan/M9yo3So+L7ifXhz8DrLTthpWlGNCz29bUIrpTWI/s6l21benUypwjNSWGmuZXm+uyrStXU7zS8WF3jOIx+Cb80eGWMnusujoW0pt27FP+2tS7bLtctHpL9Z/iYS7bdQXLSLX/E/xK53JtvV9v3Lo6jaygs8Ki4xa8mdPxXPPouZp2zZK+1op0vQvHNa8wtqXbbqmPh0mzX60vxOOXbZrMvs6XZL5yf+ZVPHrL6Mn9vqR+oyPT/iNSJ/YtCXbTrzXDTrNf4/xOOXbPuR/ZsbH6S/ErIehHz5PyyjperPqiypds25GuFrZx/Ul+Ji+2Pcz5UrVP8A6bK3xnmFw4LkR8+T8sv+L1f9Fiy7YN0r/wCtx8IY/eYPte3Y+PtaCX6CK9Q65Hy3n7ZR03Wj/CFgS7Wt3Pld0I/2cfwOOXaxvB/ZvqK/so/gaJnPMZ8SJy3/ACmOn60f4R/43eXapvJ/nKKfiqMMfuOOXahvV/nf6Uaf/aaWFwI+S/5Zfodf/SP/ACG4S7S95y/PEk/+jD8DjfaNvJvjrVT/APOH4GqZIHyX/KP0Ov8A6R/5D0/2Xbpe5tuU69xNO8pLuV1hJ5/pY8zbk+C4nmTsk3K9vbnpKrPFpdv2dVN9Oj+uD0xTlGpCM0+DWVg6Ovki1VM6pp/ps0zH7Z9OVPoSYwfFmR7uaAAAAAAAAAhy4ByH8k+Hxa3ce7afVq5xiLx6lX95yfeb5m8b9uvZWEKPWbz9DRsPvPHLmUH+ptjvz/HH0s/RsPbj75+0gArk+3ZAAQAAA7Hbdx7vq9vPOE13SyoSzBS8SpISdOpCa5xki0NKrK406jUXVF0/pfY7q2xT9elb63h7eMkfb7U+JJjDmzItzhgAAAAAAAAAAh5yRNNrGMmTIBL4dU0yy1O2lbX1tSr0pc4zWcehT+9uyKrSjVu9u1FJc/dpvil/VZdjaz1I7vE874q3hs629l1p/snw8d39ndWN1K2u6FShVi8ONSOOJ8/j5HqzdW09G3FbypX9rFya+GoliUWUhvbsy1jQXOvaZvbJZakl8UF5o0MmvNfK3aPWsOWIrb9zQgGu7wafe655oHg7EWi0cwAAhIAAAAAAAAAAC+F5jzXGPkejuxrc/wDDm3IW1xU715ZtU6jfOS6P6HnE2fs13DLbu6Le6nJq2m+5XWeHdfDPy5nthydluHM6ppRs4ZmPp6nhzfqZHDZ1YV6EK1N5hOKaOY6sTyoXmPEgAAAAAAAIaMZNJEvkcVaahSnJ9FxMLTxWf4Pdoho29rr2+qqlnKpRx82dDjjnPPmjn1Gq699WrN570mcB8s38/wA+xa68auP4sNagANNsAAAAABz59TdtiXanYTt5vPsnlenM0k7zZlxKlq3svu1I4Z2eibE4dmOPtz+p4fkwT/CwY82yTCnLPDyMz6Sp4AAAAAAAAAAAAAAAAYzjGXBpP1MiHgHpX++OzXR9e79e3hGyvHxU6ceEn5lIbr2hre267V9by9lnhXh8UWvX8cHq1p5OC9sra8oToXNCnWpzWJQnFNP5M8cmvXJ7dXS6xlwf2z6eOeb7uMNDj1Lu3x2RUa7nebeqexmln3eTyn6N8SndX0u/0q7dtqNrUtqkXhqax/7OfbDai26nUcGzH9s8S+MBcuKeQeTe8/YAAAAAAAATwT72MvkvUgLg8kxHBxF68S9BdhW5f4T0WWlXNRe9WeEsv7UOhZcXxx48TydsfXKu3dxW2o02+5H4Kkf6UX0PVOl3VK+sqN3QmpU6sFOD8U1lHR18vdXhRus6c4c3dHqX1IkhcyTZcgAAAMADFfZOp3VdK10evNfalHur5nb9DT9/3PClap8X8f0Ob1TYjDqzb8tnSxfJmrVqK55ZJC8fHiSfMJnmeV3AAQAAHPBzMegA57G0r3twqFGGZvnjlEyx0nJPGOPLG+SlI5swtaFa4rRpUIOU5P8AxG+bc0Snp1NVKnxVpc2cugaLS06nl/HVfOTO3WS+9J6J+mjvy+1W6h1Gc09tPRFLLMiESWKJifTlccAAJAAAAAAAAAAAAAADQAENPxDRIAxccrmdPuPbmk67bOjqVrCqsYU2vij6M7oh5y+H1ImIt7ZUvak81niXnvfPZRqekyndaPJ3tosvuY/jI/iVvUpVaVV0qtOUJrg011PZNSOVjuo07enZ9ou4oSqzpe7Xb/41NYb9cGnl1vPNVi0evTTiubz/AC8yYfHy+1joDat57F1zbdWUqtGVzaZ4VqSyseaXE1Xq0uLRpWrNZ8rRhz480d1JAFxz5Ah6zEx9AACAACZ5RwPHDPLJePYBueVewq6Fd1E6tu3Kll8e7zwUcueXxWOR2W2dVr6HrtrqdtJ9+lJOaTx3l1X0PTBfss0uo6sbWGa/cPXff4ZwZnWaFqVHVNMt763l36dWmpJrz5r5HZo60TzHL59as0tNZ9wAAlAAAMG8RzjJXG67n3nWar6QfdX+Zv2o1lQtalTkowbKvrTdSrKpJ5cnl/Mqn9T5+MUYodzouL/9JuxABSFk8/YABP5Ah5zhBs+7SNNuNQuFTpJqPOU+iPbBiyZbRGOPLG964qza8uLTbKvfVlSoRzl8X0RYOiaTb6bbJU45qPjOXizPSdNt9Ot1TowSf3n1Z9/RF96V0empT5Jjm0qnv9QnYt219Mkn4jBKB33NjwIAAAAAAAAAAAAAAAAAAAAAAAAAARLBEuXUyAHBcUKNxTdOtTjODWHGSymVhvrslsNQjO80Kas7nnKm/sT/AAf7C1iHwMbUrb298O1kwW5pLyFruh6jol57tqdpVoSTwp44M61Zxh4yeu9d0fTtatJ2moWsK9OX3ZLP08Cm979kd3aOrfbfl7zSS428n8a9Gc/LrzE8wtel12mWIrl8KoBy3dvWta8qFxRnSnB8YzjhxfocRrzEx7d2kxaO6PQADFlxIPlnPAB54Y8SZjlPHHlcfYBubFWtt66qtpv2lu2+vWP7F9S7eh460jUK+l6nb31rNwrUKnfXmj1ZtTWrfXtDttRt5fBVgm11T8Do62TmOJUrrmp8eT5a+pdyDGDyiUuJtODE8pAIYS17e1x7HSpU08SqPuo0Pol4cDY99XDlf06MH9iLbNc9T5z17P8ALuTH1C3dKxdmvEoXUkA4dZifbp+wA7TQNFq6lW70k426fxSf3z3wa9894pSOXjmz0w17rOPRdKralcKMFimn8U/DyLB06yoWNvGjQgopc3jmclha0bS3jSowUIRXBI+lH0PpfTK6lImfMqlu7t9i3jxDjbSeDLhgyB1+Ij00QAEgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGCyZkYfiODlGF4B45JGWCGgems7v2Voe5KEo3lsoV8fDXp/DJP5c/mUXvXs51vb0p16UHe2cXn2tNcYr+sj01KLfXBhOjCcXGaUk1hprOTxvhrZ0tPqebVn3zH4eM+b5t+nMc+mD0Rvfst0vWYzurDu2V4llSjH4ZeWCktz7Y1jbtz7LUrVwi38FSPGMvmaWXDaq2aXVMWeO3ny6QB8Fl8PUceprw6cxMHTBavYLudWWpVNCu54pXEs0cvhGXh81n6FVHPYXNWzuad1bycalKalF9c55npS01tDU3daufBan29jQS5oyXA13YO4KW4tvW19TknNx7tRZ5TXB/ibCubOtW0WjmHzvJjnFaaSybwYyeIt55Ilvgdbr917tpVepnD7rweebJGPHNp9FKza0VhoGsXHvWqVq7eU33V6HxjPxN+eR59GfJ8+S2S/dPteKVjHWKQAjj4Gw7b0Cd5ONe6XdoLio44y/A9tXSvtXilI5NnYrgpzaXBt3RKuoTVaqnGhF/4jf7a3pW9KNOlBRjFYSQo0Y0aSp00opLC4cjmwfQ+ndMx6dPEeZVDa3L7FvPpARIOpy04gAASAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAxw2v8j5NR02z1G2nbXtvTrUZrEoTipJ/Jn2E5ImIn2VtNZ5rKlN89j+PaXe3Jvx92m8/Rv9xUeo2V3p95O2vLapb1I8HGcccfLxPYrOi3RtbRtw2sqOoWkJya+GoliUX4pmtk14nzDvaHXMmHiuTzDyc+HP6+BKwpc+K5PxLA3r2X6zornc2He1Czi2/hWJxXmupX8k4tppprozQvjtSfK1YdrFniL0lY3YZud6TuH+C7mpi1vX3U3yjU6fXgj0NDD5ep4zp1J0qsZ05OMlJd2S5xfiepOy/ccNx7YoXLmncUl7OvHwkjd1cnPhWuv6UUvGWvqW0tZWPE1Xflz3LWFsvvvj8ja3yK63nc+8axKmn8NJHO69sfDpy5vTMPyZ4dO/3kR68MtkwXewknJ8om27Y27hxu75Zb4xh4FI0NHLtZIjF+1ZdraprU/u9uDbG3nX7t1eJumuMYPqzc6VONNJRSSXQmkoxXdikkuiM1g+iaPTcWnSIr7VHZ2r7Fu6fQiQDoNaAABIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACJJNNNJmh737N9F3CqlxSirO+ks+3prjJ+fib6Yd1Y5YMbVi0eXriz5MNu6kvKm7Nna3tu4avLVyoJ4jXprvRkvF+B23Y5uWeg7lhQq1ErO8ap1PDPR/v8Aqejru0oXVCdC4owq058HGaymiqt7dkttcVJXm3Z+7VuaoN/A35eBp2wTSe+qxYOr4drHOLZj2tSvUjC2nVbWFFyKwuZVLm7qSWZSlNuKXmdroGq6rX2m9M1G3qUtUtsW1WnNcZrkpLxTXHJ3+2tBhZwVxcx79b7uehx+r62Tfz1wf4/bS1L10cd8lp5/Dh2zt9UMXV3BOq+MYv7ptUUksDHDkEdvU1MWnTspDl59i2e3dYikjIiKJNqOPp4gAJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACEn1ZIAhpvqYzg5dfUzA5HA7Wk5qo4xc1yk1xRydx+PEzBERETyTzM8yjAwSCQSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/Z';

// ─────────────────────────────────────────────────────────────────
// COLOURS
// ─────────────────────────────────────────────────────────────────
const C = {
  red:         '#C62828',
  red2:        '#B71C1C',
  redLight:    '#FFEBEE',
  yellow:      '#F9A825',
  yellowLight: '#FFF8E1',
  yellow2:     '#F57F17',
  green:       '#2E7D32',
  greenLight:  '#E8F5E9',
  green2:      '#1B5E20',
  white:       '#FFFFFF',
  bg:          '#FAF9F7',
  border:      '#E0DDD8',
  grey:        '#6B7280',
  greyLight:   '#F3F2F0',
  text:        '#1A1A1A',
};

// ─────────────────────────────────────────────────────────────────
// VALIDATION HELPERS
// ─────────────────────────────────────────────────────────────────
const isValidCell = v => /^\d{10}$/.test((v || '').replace(/\s/g, ''));
const isValidID   = v => /^\d{13}$/.test((v || '').replace(/\s/g, ''));
const isNotFuture = v => { if (!v) return false; const d = new Date(v); d.setHours(0,0,0,0); const t = new Date(); t.setHours(0,0,0,0); return d <= t; };
const digitsOnly  = v => v.replace(/[^\d]/g, '');

// ─────────────────────────────────────────────────────────────────
// CLASSIFIER DATA
// ─────────────────────────────────────────────────────────────────
const QUESTIONS = [
  { id:1,  text:'Was there contact with a fixed object?',                                                  hint:'e.g. wall, pole, tree, parked vehicle, or barrier',  yes:'FIXED_OBJECT',    no:2  },
  { id:2,  text:'Did your vehicle strike the other vehicle from behind?',                                  hint:null,                                                  yes:'REAR_END',        no:3  },
  { id:3,  text:'Did the other vehicle strike you from behind?',                                           hint:null,                                                  yes:'REAR_END',        no:4  },
  { id:4,  text:'Did the vehicles collide front-to-front (head-on)?',                                     hint:'Direct frontal impact — both front ends damaged',     yes:'HEAD_ON',         no:5  },
  { id:5,  text:'Did the collision occur at an intersection?',                                             hint:'With or without traffic lights',                      yes:6,                 no:9  },
  { id:6,  text:'Did one vehicle strike the other on the SIDE?',                                          hint:'e.g. T-bone; impact to door area',                    yes:'SIDE_IMPACT',     no:7  },
  { id:7,  text:'Did the collision occur while one vehicle was turning (left or right)?',                  hint:null,                                                  yes:'TURNING',         no:8  },
  { id:8,  text:'Did the vehicles lightly scrape or swipe each other at the intersection?',               hint:null,                                                  yes:'SIDE_SWIPE',      no:9  },
  { id:9,  text:'Did you or the other vehicle change lanes shortly before impact?',                        hint:null,                                                  yes:'LANE_CHANGE',     no:10 },
  { id:10, text:'Did the vehicles make light side-to-side contact while travelling in the same direction?',hint:'Parallel movement',                                   yes:'SIDE_SWIPE',      no:11 },
  { id:11, text:'Was the other vehicle moving inside a parking area or parking-lot lanes?',               hint:'Low speed between bays',                              yes:'PARKING',         no:12 },
  { id:12, text:'Were more than two vehicles involved?',                                                  hint:null,                                                  yes:'MULTI_VEHICLE',   no:13 },
  { id:13, text:'Did the other driver flee the scene?',                                                   hint:null,                                                  yes:'HIT_AND_RUN',     no:14 },
  { id:14, text:'Was this a single-vehicle incident (no other vehicle was struck)?',                      hint:'Skidded, rolled, hit an object, left roadway',        yes:'SINGLE_VEHICLE',  no:15 },
  { id:15, text:'Was a pedestrian, cyclist, or motorcyclist involved?',                                   hint:null,                                                  yes:'PEDESTRIAN',      no:'NOT_CLASSIFIABLE' },
];

const OUTCOMES = {
  FIXED_OBJECT:     { label:'Fixed Object Collision',                            claimable:false, icon:'⚠️', subQs:[
    { id:'fq_object',    label:'Object struck',                              type:'text',  placeholder:'Describe the object that was struck' },
    { id:'fq_road_cond', label:'Did you lose control due to road conditions?',type:'ynu'                                                     },
    { id:'fq_road_desc', label:'If Yes — describe conditions',               type:'text',  placeholder:'e.g. wet road, pothole',    conditionalOn:'fq_road_cond'  },
    { id:'fq_avoiding',  label:'Were you avoiding another road user?',        type:'ynu'                                                     },
    { id:'fq_mech',      label:'Was mechanical failure suspected?',           type:'ynu'                                                     },
    { id:'fq_parked',    label:'Was a parked vehicle struck?',                type:'ynu'                                                     },
    { id:'fq_damage',    label:'Was there property damage beyond your vehicle?',type:'ynu'                                                   },
  ]},
  REAR_END:         { label:'Rear-end Collision',                               claimable:true,  icon:'⚖️', subQs:[
    { id:'rq_front',     label:'Were you the front vehicle?',                 type:'ynu'  },
    { id:'rq_stationary',label:'Were you stationary at time of impact?',      type:'ynu'  },
    { id:'rq_slowing',   label:'Were you slowing down?',                      type:'ynu'  },
    { id:'rq_braked',    label:'Did you brake before impact?',                type:'ynu'  },
    { id:'rq_reason',    label:'Was there a clear reason for slowing/stopping?',type:'ynu'},
    { id:'rq_reason_d',  label:'If Yes — describe reason',                    type:'text', placeholder:'e.g. traffic light, jam', conditionalOn:'rq_reason' },
    { id:'rq_you_lane',  label:'Did YOU change lanes just before impact?',    type:'ynu'  },
    { id:'rq_other_lane',label:'Did the OTHER vehicle change lanes?',         type:'ynu'  },
    { id:'rq_follow',    label:'Estimate following distance',                  type:'text', placeholder:'e.g. 2 car lengths / 5 metres' },
  ]},
  HEAD_ON:          { label:'Head-on Collision',                                claimable:true,  icon:'⚖️', subQs:[
    { id:'hq_correct',   label:'Were you in the correct lane?',               type:'ynu'  },
    { id:'hq_entered',   label:'Did the other vehicle enter your lane?',      type:'ynu'  },
    { id:'hq_overtaking',label:'Was overtaking involved?',                    type:'ynu'  },
    { id:'hq_markings',  label:'Were road markings visible?',                 type:'ynu'  },
    { id:'hq_braked',    label:'Did you brake before impact?',                type:'ynu'  },
    { id:'hq_swerved',   label:'Did you swerve to avoid the collision?',      type:'ynu'  },
    { id:'hq_swerve_d',  label:'If Yes — in which direction?',               type:'text', placeholder:'e.g. Left', conditionalOn:'hq_swerved' },
    { id:'hq_daylight',  label:'Was it daylight at the time?',                type:'ynu'  },
    { id:'hq_wet',       label:'Was the road wet or slippery?',               type:'ynu'  },
  ]},
  SIDE_IMPACT:      { label:'Side-impact / T-bone Collision',                   claimable:true,  icon:'⚖️', subQs:[
    { id:'sq_lights',    label:'Were traffic lights present?',                type:'ynu'  },
    { id:'sq_green',     label:'Did you have a green light?',                 type:'ynu'  },
    { id:'sq_stop',      label:'Were there stop signs present?',              type:'ynu'  },
    { id:'sq_stopped',   label:'Did you stop at the stop sign?',              type:'ynu'  },
    { id:'sq_straight',  label:'Were you driving straight?',                  type:'ynu'  },
    { id:'sq_side_hit',  label:'Which side of your vehicle was hit?',         type:'text', placeholder:'Left / Right' },
    { id:'sq_from_left', label:'Did the other vehicle come from the LEFT?',   type:'ynu'  },
    { id:'sq_from_right',label:'Did the other vehicle come from the RIGHT?',  type:'ynu'  },
    { id:'sq_direction', label:'Your direction of travel',                    type:'text', placeholder:'e.g. North on Main Street' },
  ]},
  TURNING:          { label:'Turning / Intersection-turn Collision',            claimable:true,  icon:'⚖️', subQs:[
    { id:'tq_you_turn',  label:'Were you the one turning?',                   type:'ynu'  },
    { id:'tq_left',      label:'Were you turning LEFT?',                      type:'ynu'  },
    { id:'tq_right',     label:'Were you turning RIGHT?',                     type:'ynu'  },
    { id:'tq_intersect', label:'Did the turn occur at an intersection?',      type:'ynu'  },
    { id:'tq_stationary',label:'Were you stationary before turning?',         type:'ynu'  },
    { id:'tq_control',   label:'Was traffic control present?',                type:'ynu'  },
    { id:'tq_ctrl_type', label:'If Yes — type of control',                   type:'text', placeholder:'traffic lights, stop, yield', conditionalOn:'tq_control' },
    { id:'tq_oncoming',  label:'Was the other vehicle oncoming?',             type:'ynu'  },
    { id:'tq_impact_pt', label:'Where in the turn did impact occur?',         type:'text', placeholder:'Start / Middle / End of turn' },
  ]},
  SIDE_SWIPE:       { label:'Side-swipe Collision',                            claimable:true,  icon:'⚖️', subQs:[
    { id:'ssq_same_dir', label:'Were both vehicles travelling in the same direction?',type:'ynu' },
    { id:'ssq_moving',   label:'Were both vehicles moving at time of contact?',      type:'ynu' },
    { id:'ssq_light',    label:'Was it a light scraping / glancing contact?',         type:'ynu' },
    { id:'ssq_you_chg',  label:'Did YOU change lanes shortly before impact?',         type:'ynu' },
    { id:'ssq_oth_chg',  label:'Did the OTHER vehicle change lanes?',                 type:'ynu' },
    { id:'ssq_indicator',label:'Did you use your indicator?',                         type:'ynu' },
    { id:'ssq_contact',  label:'Where did contact begin on your vehicle?',            type:'text', placeholder:'e.g. Front left door / Rear quarter panel' },
  ]},
  LANE_CHANGE:      { label:'Lane-change Collision',                           claimable:true,  icon:'⚖️', subQs:[
    { id:'lq_you',       label:'Did YOU change lanes?',                       type:'ynu'  },
    { id:'lq_other',     label:'Did the OTHER vehicle change lanes?',         type:'ynu'  },
    { id:'lq_indicator', label:'Did you use your indicator?',                 type:'ynu'  },
    { id:'lq_blind',     label:'Was there a blind spot issue?',               type:'ynu'  },
    { id:'lq_lanes',     label:'From lane → to lane',                        type:'text', placeholder:'e.g. Lane 1 to Lane 2' },
    { id:'lq_impact',    label:'Where on your vehicle did impact occur?',     type:'text', placeholder:'e.g. Rear left quarter panel' },
  ]},
  PARKING:          { label:'Parking-area Collision',                          claimable:true,  icon:'⚖️', subQs:[
    { id:'pq_you_rev',   label:'Were YOU reversing?',                         type:'ynu'  },
    { id:'pq_oth_rev',   label:'Was the OTHER vehicle reversing?',            type:'ynu'  },
    { id:'pq_pull_in',   label:'Were you pulling into a parking bay?',        type:'ynu'  },
    { id:'pq_pull_out',  label:'Were you pulling out of a parking bay?',      type:'ynu'  },
    { id:'pq_obstructed',label:'Was visibility obstructed?',                  type:'ynu'  },
    { id:'pq_obs_desc',  label:'If Yes — what caused the obstruction?',      type:'text', placeholder:'e.g. large vehicle, pillar', conditionalOn:'pq_obstructed' },
    { id:'pq_area_name', label:'Parking area name',                           type:'text', placeholder:'e.g. Eastgate Mall / Office Park' },
  ]},
  MULTI_VEHICLE:    { label:'Multi-vehicle / Chain Collision',                  claimable:true,  icon:'⚖️', subQs:[
    { id:'mq_struck',    label:'Were you struck first?',                      type:'ynu'  },
    { id:'mq_pushed',    label:'Were you pushed into another vehicle?',       type:'ynu'  },
    { id:'mq_stationary',label:'Were you stationary before secondary impacts?',type:'ynu' },
    { id:'mq_highway',   label:'Did the collision occur on a highway/freeway?',type:'ynu' },
    { id:'mq_count',     label:'Estimated number of vehicles involved',       type:'text', placeholder:'e.g. 3 vehicles' },
    { id:'mq_sequence',  label:'Describe the sequence of impacts',            type:'textarea', placeholder:'e.g. Vehicle A struck me, I was pushed into Vehicle B' },
  ]},
  HIT_AND_RUN:      { label:'Hit and Run',                                     claimable:true,  icon:'⚖️', subQs:[
    { id:'hrq_fled',     label:'Did the other driver leave without stopping?', type:'ynu' },
    { id:'hrq_details',  label:'Were any identifying details obtained?',       type:'ynu' },
    { id:'hrq_det_desc', label:'If Yes — colour, registration, description',  type:'text', placeholder:'e.g. White Toyota, GP 123-456', conditionalOn:'hrq_details' },
    { id:'hrq_direction',label:'Direction the vehicle fled',                   type:'text', placeholder:'e.g. Northbound on Commissioner Street' },
    { id:'hrq_witnesses',label:'Were there any witnesses?',                    type:'ynu' },
    { id:'hrq_cctv',     label:'Is CCTV footage possibly available nearby?',  type:'ynu' },
    { id:'hrq_reported', label:'Was the incident reported immediately to SAPS?',type:'ynu'},
  ]},
  SINGLE_VEHICLE:   { label:'Single-vehicle Collision',                         claimable:false, icon:'⚠️', subQs:[
    { id:'svq_left_road',label:'Did the vehicle leave the roadway?',           type:'ynu' },
    { id:'svq_rolled',   label:'Did the vehicle roll over?',                   type:'ynu' },
    { id:'svq_struck',   label:'Did the vehicle strike an object after leaving the roadway?', type:'ynu' },
    { id:'svq_obj_desc', label:'If Yes — what object was struck?',            type:'text', placeholder:'e.g. tree, barrier', conditionalOn:'svq_struck' },
    { id:'svq_road_cond',label:'Were road conditions a contributing factor?',  type:'ynu' },
    { id:'svq_rest_pos', label:'Final resting position of the vehicle',        type:'text', placeholder:'Describe where the vehicle came to rest' },
  ]},
  PEDESTRIAN:       { label:'Collision with Pedestrian / Cyclist / Motorcyclist', claimable:true, icon:'⚖️', subQs:[
    { id:'peq_user',     label:'Which road user was involved?',               type:'text', placeholder:'Pedestrian / Cyclist / Motorcyclist' },
    { id:'peq_crossing', label:'Did it occur at a marked pedestrian crossing?',type:'ynu' },
    { id:'peq_vis',      label:'Was visibility limited at the time?',          type:'ynu' },
    { id:'peq_vis_desc', label:'If Yes — reason',                             type:'text', placeholder:'e.g. heavy rain, dark conditions', conditionalOn:'peq_vis' },
    { id:'peq_braked',   label:'Did you brake before impact?',                type:'ynu' },
    { id:'peq_moved',    label:'Did the person move into your path?',          type:'ynu' },
    { id:'peq_injuries', label:'Were injuries visible?',                       type:'ynu' },
    { id:'peq_inj_desc', label:'If Yes — describe visible injuries',          type:'text', placeholder:'e.g. leg injury, abrasions', conditionalOn:'peq_injuries' },
    { id:'peq_dir',      label:'Direction of travel of the road user',         type:'text', placeholder:'e.g. Crossing from right to left' },
  ]},
  NOT_CLASSIFIABLE: { label:'Not Classifiable', claimable:false, icon:'⚠️', subQs:[] },
};

const PROVINCES    = ['Eastern Cape','Free State','Gauteng','KwaZulu-Natal','Limpopo','Mpumalanga','Northern Cape','North West','Western Cape'];
const RELATIONSHIPS = ['Owner','Renter','Employee','Borrowed','Other'];
const MONTHS       = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// ─────────────────────────────────────────────────────────────────
// STORAGE
// ─────────────────────────────────────────────────────────────────
const STORE_KEY = 'saps_v3';
async function loadDrafts()          { try { const r = await AsyncStorage.getItem(STORE_KEY); return r ? JSON.parse(r) : []; } catch { return []; } }
async function saveDraft(d)          { try { const list = await loadDrafts(); const i = list.findIndex(x => x.id === d.id); if (i >= 0) list[i] = d; else list.unshift(d); await AsyncStorage.setItem(STORE_KEY, JSON.stringify(list)); } catch {} }
async function deleteDraft(id)       { try { const list = await loadDrafts(); await AsyncStorage.setItem(STORE_KEY, JSON.stringify(list.filter(x => x.id !== id))); } catch {} }

function createDraft() {
  const now  = new Date();
  const id   = `${now.getFullYear()}-${String(Math.floor(Math.random()*900)+100)}`;
  return {
    id, reportNumber:id, createdAt:now.toISOString(), status:'In Progress',
    driver:   { fullName:'', cellOrEmail:'', idNumber:'', address:'', licenceNumber:'', relationship:'' },
    vehicle:  { registration:'', make:'', model:'', year:'', colour:'', trailerInvolved:false, trailerReg:'' },
    accident: { date:'', time:'', street:'', landmark:'', city:'', province:'', caseNumber:'' },
    classifierAnswers:{}, accidentKey:null, subAnswers:{},
    otherParties:[], witnesses:[], statementText:'',
    consentMarketing:false, consentMyLawSA:false,
  };
}

// ─────────────────────────────────────────────────────────────────
// STATEMENT BUILDER
// ─────────────────────────────────────────────────────────────────
const ph = (v, fb) => (v && String(v).trim()) ? String(v).trim() : `[${fb}]`;

function buildCircumstances(key, accident, sub, parties) {
  const street = ph(accident.street, 'STREET / ROAD');
  const o      = parties?.[0] ?? {};
  const oName  = ph(o.name,         'OTHER DRIVER NAME');
  const oReg   = ph(o.registration, 'OTHER REG');
  const oMake  = ph(o.make,         'OTHER MAKE');
  const oModel = ph(o.model,        'OTHER MODEL');
  const dir    = '[direction of travel]';

  switch (key) {
    case 'FIXED_OBJECT': {
      const obj = ph(sub.fq_object, 'OBJECT STRUCK');
      let p = `On the date and at the time stated above, I was travelling in a ${dir} direction along ${street}. My vehicle made contact with ${obj}, which was situated adjacent to or on the roadway.\n\nAt the time of the incident, the fixed object was stationary and the impact was not as a result of a collision with another moving vehicle.`;
      if (sub.fq_road_cond === 'y' && sub.fq_road_desc) p += `\n\nThe road conditions at the time were ${sub.fq_road_desc.trim()}, which contributed to my loss of vehicle control.`;
      if (sub.fq_avoiding  === 'y') p += `\n\nI was executing an avoidance manoeuvre to prevent a collision with another road user, which caused my vehicle to come into contact with the fixed object.`;
      if (sub.fq_mech      === 'y') p += `\n\nI suspected a mechanical failure in my vehicle at the time of the incident.`;
      return p + `\n\nAs a result of the impact, my vehicle sustained the damage described in the damage section of this statement.`;
    }
    case 'REAR_END': {
      const dist = sub.rq_follow?.trim() || '[following distance]';
      return `On the date and at the time stated above, I was travelling in a ${dir} direction along ${street}. I was travelling behind the vehicle of ${oName}, registration number ${oReg}, a ${oMake} ${oModel}.\n\nThe vehicle ahead slowed and/or stopped. My vehicle made contact with the rear of the said vehicle. The estimated following distance at the time was ${dist}.\n\nAs a result of the collision, my vehicle sustained the damage described in the damage section of this statement.`;
    }
    case 'HEAD_ON':
      return `On the date and at the time stated above, I was travelling in a ${dir} direction along ${street}, within my correct lane of travel. The vehicle driven by ${oName}, registration number ${oReg}, a ${oMake} ${oModel}, was travelling in the opposite direction and crossed into my lane of travel, resulting in a frontal collision.\n\nI applied my brakes upon observing the oncoming vehicle in my lane but was unable to avoid the collision. The collision was caused by the other driver's failure to remain within their designated lane of travel.\n\nAs a result of the collision, my vehicle sustained the damage described in the damage section of this statement.`;
    case 'SIDE_IMPACT': {
      const tc = sub.sq_lights === 'y' ? `There were traffic lights at the intersection${sub.sq_green === 'y' ? ' and I had a green light' : ''}. ` : '';
      return `On the date and at the time stated above, I was travelling in a ${dir} direction along ${street} and entered the intersection in the normal course of travel. ${tc}The vehicle of ${oName}, registration number ${oReg}, a ${oMake} ${oModel}, approached from the side and collided with my vehicle at the intersection.\n\nThe collision was caused by the failure of the other driver to observe the applicable traffic control devices and/or to yield the right of way to my vehicle.\n\nAs a result of the collision, my vehicle sustained the damage described in the damage section of this statement.`;
    }
    case 'TURNING': {
      const td = sub.tq_left === 'y' ? 'left' : sub.tq_right === 'y' ? 'right' : '';
      return `On the date and at the time stated above, I was in the process of executing a ${td ? td + '-turn' : 'turning'} manoeuvre on ${street}. During the turning manoeuvre, the vehicle of ${oName}, registration number ${oReg}, a ${oMake} ${oModel}, collided with my vehicle.\n\nThe collision was caused by the failure of the other driver to exercise due care and to yield the right of way.\n\nAs a result of the collision, my vehicle sustained the damage described in the damage section of this statement.`;
    }
    case 'SIDE_SWIPE':
      return `On the date and at the time stated above, I was travelling in a ${dir} direction along ${street}, within my designated lane of travel. The vehicle of ${oName}, registration number ${oReg}, a ${oMake} ${oModel}, was travelling in an adjacent lane in the same direction and moved laterally towards my lane, making scraping contact with my vehicle.\n\nThe collision was caused by the other driver's failure to ensure sufficient clearance before changing lanes.\n\nAs a result of the collision, my vehicle sustained the damage described in the damage section of this statement.`;
    case 'LANE_CHANGE': {
      const lanes = sub.lq_lanes?.trim() || '';
      return `On the date and at the time stated above, I was travelling in a ${dir} direction along ${street}. A lane-change collision occurred involving my vehicle and the vehicle of ${oName}, registration number ${oReg}, a ${oMake} ${oModel}.\n\n${lanes ? `The lane change was from ${lanes}. ` : ''}The other vehicle executed a lane change without ensuring that the lane was clear, making contact with my vehicle.\n\nAs a result of the collision, my vehicle sustained the damage described in the damage section of this statement.`;
    }
    case 'PARKING': {
      const area = sub.pq_area_name?.trim() || '';
      return `On the date and at the time stated above, I was driving within a parking area${area ? ` (${area})` : ''} when a collision occurred involving my vehicle and the vehicle of ${oName}, registration number ${oReg}, a ${oMake} ${oModel}. Both vehicles were manoeuvring within the parking area at very low speed.\n\nThe collision was caused by the other driver's failure to keep a proper lookout and to yield to my vehicle.\n\nAs a result of the collision, my vehicle sustained the damage described in the damage section of this statement.`;
    }
    case 'MULTI_VEHICLE': {
      const count = sub.mq_count?.trim()    || '[number of vehicles]';
      const seq   = sub.mq_sequence?.trim() || '[sequence of impacts]';
      return `On the date and at the time stated above, I was travelling in a ${dir} direction along ${street} when a multi-vehicle collision occurred involving ${count}.\n\n${seq}\n\nThe initial impact was caused by the negligence of ${oName}, registration number ${oReg}, a ${oMake} ${oModel}.\n\nAs a result of the collision, my vehicle sustained the damage described in the damage section of this statement.`;
    }
    case 'HIT_AND_RUN': {
      const fled    = sub.hrq_direction?.trim() || '[direction]';
      const details = sub.hrq_det_desc ? `\n\nI was able to note the following identifying details of the fleeing vehicle: ${sub.hrq_det_desc.trim()}.` : '';
      return `On the date and at the time stated above, I was travelling in a ${dir} direction along ${street} when an unknown vehicle collided with my vehicle. Following the collision, the driver of the other vehicle failed to stop as required by law and fled the scene in a ${fled} direction.${details}\n\nThe incident was reported to the South African Police Service. The damage sustained to my vehicle was caused directly by the collision with the fleeing vehicle.`;
    }
    case 'SINGLE_VEHICLE': {
      const rest = sub.svq_rest_pos?.trim() || '';
      return `On the date and at the time stated above, I was travelling in a ${dir} direction along ${street} when a single-vehicle incident occurred involving only my vehicle. No other vehicle was involved in the incident.\n\n${rest ? `My vehicle came to rest at ${rest}. ` : ''}The circumstances of the incident are as captured in the classification section of this statement.\n\nAs a result of the incident, my vehicle sustained the damage described in the damage section of this statement.`;
    }
    case 'PEDESTRIAN': {
      const user = sub.peq_user?.trim() || 'pedestrian / cyclist / motorcyclist';
      return `On the date and at the time stated above, I was travelling in a ${dir} direction along ${street} when a collision occurred involving my vehicle and a ${user}.\n\nThe circumstances of the collision are as captured in the classification section of this statement. My vehicle sustained damage as a result of the collision.`;
    }
    default:
      return `On the date and at the time stated above, I was travelling along ${street} when a road traffic incident occurred.\n\n[PLEASE DESCRIBE THE CIRCUMSTANCES OF THE ACCIDENT IN YOUR OWN WORDS — this accident type could not be automatically classified]\n\nThe other vehicle involved was driven by ${oName}, registration number ${oReg}. As a result of the incident, my vehicle sustained damage.`;
  }
}

function buildStatement(draft) {
  const { driver, vehicle, accident, accidentKey, subAnswers, otherParties, witnesses } = draft;
  const sub  = subAnswers   || {};
  const pars = otherParties || [];
  const wits = witnesses    || [];
  const o    = pars[0]      || {};
  const line = '─'.repeat(40);

  const dateStr = accident.date
    ? (() => { const d = new Date(accident.date); return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`; })()
    : '[DATE]';

  let s = `SAPS ACCIDENT STATEMENT\n${line}\n`;
  if (accident.caseNumber?.trim()) s += `SAPS Case Number: ${accident.caseNumber.trim()}\n`;

  s += `\nI, ${ph(driver.fullName,'FULL NAME')}, ID / Passport No. ${ph(driver.idNumber,'ID / PASSPORT NUMBER')}, residing at ${driver.address?.trim() || '[RESIDENTIAL ADDRESS]'}, hereby declare the following:\n`;
  s += `\n${line}\n1. MY VEHICLE\n${line}\n`;
  s += `I am the ${driver.relationship || 'owner'} of a ${ph(vehicle.colour,'COLOUR')} ${ph(vehicle.year,'YEAR')} ${ph(vehicle.make,'MAKE')} ${ph(vehicle.model,'MODEL')}, registration number ${ph(vehicle.registration,'REGISTRATION')}.\n`;
  if (vehicle.trailerInvolved && vehicle.trailerReg) s += `A trailer with registration number ${vehicle.trailerReg} was also attached to my vehicle.\n`;

  s += `\n${line}\n2. THE ACCIDENT\n${line}\n`;
  s += `On ${dateStr} at approximately ${accident.time || '[TIME]'}, I was involved in a road traffic accident on ${ph(accident.street,'STREET / ROAD')}${accident.landmark?.trim() ? `, near ${accident.landmark.trim()}` : ''}, in ${ph(accident.city,'CITY')}, ${accident.province || '[PROVINCE]'}.\n`;

  s += `\n${line}\n3. CIRCUMSTANCES\n${line}\n`;
  s += buildCircumstances(accidentKey, accident, sub, pars) + '\n';

  s += `\n${line}\n4. OTHER PARTY\n${line}\n`;
  if (pars.length > 0) {
    pars.forEach((p, i) => {
      s += `${i > 0 ? '\n' : ''}The ${i === 0 ? 'other' : `additional (${i+1})`} vehicle involved was a ${ph(p.make,'MAKE')} ${ph(p.model,'MODEL')}, registration number ${ph(p.registration,'REG')}, driven by ${ph(p.name,'DRIVER NAME')}.\n`;
    });
  } else {
    s += `The other vehicle involved was a ${ph(o.make,'OTHER MAKE')} ${ph(o.model,'OTHER MODEL')}, registration number ${ph(o.registration,'OTHER REG')}, driven by ${ph(o.name,'OTHER DRIVER NAME')}.\n`;
  }
  if (wits.length > 0) { s += `\nWitness(es):\n`; wits.forEach((w,i) => { s += `${i+1}. ${ph(w.name,'WITNESS NAME')}${w.contact ? ` — ${w.contact}` : ''}\n`; }); }

  s += `\n${line}\n5. DAMAGES\n${line}\n`;
  s += `My vehicle sustained damage as a result of the collision. I attach photographs as Annexure A.\n`;

  s += `\n${line}\n6. DECLARATION\n${line}\n`;
  s += `I declare that the contents of this statement are true and correct to the best of my knowledge and belief.\n`;
  s += `\n\nSignature: _________________________\n\nDate: _____________________________\n`;
  return s;
}

// ─────────────────────────────────────────────────────────────────
// SHARED UI COMPONENTS
// ─────────────────────────────────────────────────────────────────

function TopBar({ title, subtitle, onBack }) {
  return (
    <View style={ui.topBar}>
      <View style={ui.topBarRow}>
        {onBack && (
          <TouchableOpacity style={ui.backBtn} onPress={onBack} activeOpacity={0.75}>
            <Text style={ui.backBtnTxt}>‹</Text>
          </TouchableOpacity>
        )}
        <Image source={{ uri: LOGO_B64 }} style={{ width: 36, height: 36, borderRadius: 8 }} resizeMode="contain" />
        <View style={{ flex: 1 }}>
          <Text style={ui.barTitle}>{title}</Text>
          {subtitle ? <Text style={ui.barSub}>{subtitle}</Text> : null}
        </View>
      </View>
    </View>
  );
}

function ProgressBar({ step, total, label }) {
  return (
    <View style={ui.progressWrap}>
      <View style={ui.progressTrack}>
        <View style={[ui.progressFill, { width: `${Math.min(100, (step / total) * 100)}%` }]} />
      </View>
      {label ? <Text style={ui.progressLbl}>{label}</Text> : null}
    </View>
  );
}

function FieldLabel({ children, required }) {
  return <Text style={ui.fieldLbl}>{children}{required ? <Text style={{ color: C.yellow }}> *</Text> : null}</Text>;
}

function Field({ label, required, children, style }) {
  return (
    <View style={[{ marginBottom: 14 }, style]}>
      <FieldLabel required={required}>{label}</FieldLabel>
      {children}
    </View>
  );
}

function Inp({ value, onChangeText, placeholder, multiline, numberOfLines, keyboardType, editable, style, error }) {
  return (
    <>
      <TextInput
        style={[ui.inp, multiline && { minHeight: 88, textAlignVertical: 'top' }, error && { borderColor: C.red, borderWidth: 2 }, style]}
        value={value} onChangeText={onChangeText} placeholder={placeholder}
        placeholderTextColor="#bbb" keyboardType={keyboardType}
        multiline={multiline} numberOfLines={numberOfLines} editable={editable !== false}
      />
      {error ? <Text style={{ fontSize: 11, color: C.red, marginTop: 4, fontWeight: '600' }}>{error}</Text> : null}
    </>
  );
}

function PickBtn({ value, placeholder, onPress }) {
  return (
    <TouchableOpacity style={[ui.inp, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]} onPress={onPress} activeOpacity={0.75}>
      <Text style={[{ fontSize: 15, color: C.text }, !value && { color: '#bbb' }]}>{value || placeholder}</Text>
      <Text style={{ color: C.grey, fontSize: 14 }}>▾</Text>
    </TouchableOpacity>
  );
}

function YNU({ value, onChange }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
      {[{ l: 'Yes', v: 'y' }, { l: 'No', v: 'n' }, { l: 'Unknown', v: 'u' }].map(o => {
        const sel = value === o.v;
        const bg  = sel ? (o.v === 'y' ? C.green : o.v === 'n' ? C.red : C.yellow) : C.greyLight;
        return (
          <TouchableOpacity key={o.v}
            style={{ flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, borderColor: sel ? bg : C.border, backgroundColor: bg, alignItems: 'center' }}
            onPress={() => onChange(o.v)} activeOpacity={0.8}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: sel ? 'white' : C.grey }}>{o.l}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function CheckRow({ label, sublabel, checked, onChange }) {
  return (
    <TouchableOpacity style={[ui.checkRow, checked && { borderColor: C.red, backgroundColor: C.redLight }]} onPress={() => onChange(!checked)} activeOpacity={0.8}>
      <View style={[ui.checkBox, checked && { backgroundColor: C.red, borderColor: C.red }]}>
        {checked && <Text style={{ color: 'white', fontSize: 11, fontWeight: '800' }}>✓</Text>}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={ui.checkLbl}>{label}</Text>
        {sublabel ? <Text style={{ fontSize: 12, color: C.grey, marginTop: 3 }}>{sublabel}</Text> : null}
      </View>
    </TouchableOpacity>
  );
}

function Btn({ label, onPress, disabled, color }) {
  return (
    <TouchableOpacity style={[ui.btn, { backgroundColor: disabled ? '#ccc' : (color || C.red) }]} onPress={onPress} disabled={!!disabled} activeOpacity={0.85}>
      <Text style={ui.btnTxt}>{label}</Text>
    </TouchableOpacity>
  );
}

function BtnGhost({ label, onPress }) {
  return (
    <TouchableOpacity style={[ui.btn, { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: C.border }]} onPress={onPress} activeOpacity={0.85}>
      <Text style={[ui.btnTxt, { color: C.text }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function BottomBar({ children }) {
  return <View style={ui.bottomBar}>{children}</View>;
}

function InfoBox({ icon, children }) {
  return (
    <View style={ui.infoBox}>
      {icon ? <Text style={{ fontSize: 18 }}>{icon}</Text> : null}
      <Text style={{ flex: 1, fontSize: 13, color: C.grey, lineHeight: 19 }}>{children}</Text>
    </View>
  );
}

function Disclaimer() {
  return (
    <View style={ui.disclaimer}>
      <Text style={ui.disclaimerTitle}>DECLARATION & DISCLAIMER</Text>
      <Text style={ui.disclaimerTxt}>This statement has been generated based solely on information provided by the individual. The accuracy, completeness, and truthfulness of the contents remain the full responsibility of the person who supplied the information.</Text>
    </View>
  );
}

function Banner({ claimable, label, description }) {
  return (
    <View style={[ui.banner, { backgroundColor: claimable ? C.greenLight : C.yellowLight, borderColor: claimable ? '#81C784' : '#FFD54F' }]}>
      <Text style={{ fontSize: 26 }}>{claimable ? '⚖️' : '⚠️'}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[ui.bannerTitle, { color: claimable ? C.green2 : C.yellow2 }]}>{label}</Text>
        <Text style={[ui.bannerSub,   { color: claimable ? C.green2 : C.yellow2 }]}>{description}</Text>
      </View>
    </View>
  );
}

function Tabs({ tabs, active, onPress }) {
  return (
    <View style={ui.tabs}>
      {tabs.map((t, i) => (
        <TouchableOpacity key={t} style={[ui.tabBtn, i === active && { backgroundColor: C.red }]} onPress={() => onPress(i)}>
          <Text style={[{ fontSize: 13, fontWeight: '600', color: C.grey }, i === active && { color: 'white' }]}>{t}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function ListPicker({ visible, title, options, onSelect, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={ui.sheetOverlay} activeOpacity={1} onPress={onClose}>
        <View style={ui.sheet}>
          <View style={ui.sheetHandle} />
          <Text style={ui.sheetTitle}>{title}</Text>
          <FlatList data={options} keyExtractor={x => x} renderItem={({ item }) => (
            <TouchableOpacity style={ui.sheetItem} onPress={() => { onSelect(item); onClose(); }}>
              <Text style={{ fontSize: 15, color: C.text }}>{item}</Text>
            </TouchableOpacity>
          )} />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

// Simple date picker built with modals — no native module needed
function DatePickerModal({ visible, value, onChange, onClose }) {
  const now    = new Date();
  const todayY = now.getFullYear();
  const todayM = now.getMonth();     // 0-indexed
  const todayD = now.getDate();

  const years  = Array.from({ length: 5 }, (_, i) => String(todayY - i));
  const parsed = value ? new Date(value) : now;

  const [selYear,  setYear]  = useState(String(parsed.getFullYear()));
  const [selMonth, setMonth] = useState(MONTHS[parsed.getMonth()]);
  const [selDay,   setDay]   = useState(String(parsed.getDate()).padStart(2, '0'));
  const [step,     setStep]  = useState('year');

  // Available months: if selected year == today's year, only show months up to current month
  const availableMonths = Number(selYear) < todayY
    ? MONTHS
    : MONTHS.slice(0, todayM + 1);

  // Available days: if selected year + month == today, only show days up to today
  const daysInMonth = new Date(Number(selYear), MONTHS.indexOf(selMonth) + 1, 0).getDate();
  const isCurrentMonth = Number(selYear) === todayY && MONTHS.indexOf(selMonth) === todayM;
  const maxDay = isCurrentMonth ? todayD : daysInMonth;
  const availableDays = Array.from({ length: maxDay }, (_, i) => String(i + 1).padStart(2, '0'));

  const confirm = (day) => {
    const mi = MONTHS.indexOf(selMonth);
    const d  = new Date(Number(selYear), mi, Number(day));
    onChange(d.toISOString());
    onClose();
    setStep('year');
  };

  const lists  = { year: years, month: availableMonths, day: availableDays };
  const titles = { year: 'Select Year (accident cannot be in the future)', month: 'Select Month', day: 'Select Day' };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={ui.sheetOverlay} activeOpacity={1} onPress={onClose}>
        <View style={ui.sheet}>
          <View style={ui.sheetHandle} />
          <Text style={ui.sheetTitle}>{titles[step]}</Text>
          <Text style={{ fontSize: 12, color: C.grey, marginBottom: 10 }}>
            Selected: {selDay} {selMonth} {selYear}
          </Text>
          <FlatList
            data={lists[step]}
            keyExtractor={x => x}
            renderItem={({ item }) => {
              const cur = step === 'year' ? selYear : step === 'month' ? selMonth : selDay;
              return (
                <TouchableOpacity
                  style={[ui.sheetItem, item === cur && { backgroundColor: C.redLight }]}
                  onPress={() => {
                    if (step === 'year') {
                      setYear(item);
                      // If switching to a year where current selMonth is now in the future, reset month
                      if (Number(item) === todayY && MONTHS.indexOf(selMonth) > todayM) {
                        setMonth(MONTHS[todayM]);
                        setDay(String(todayD).padStart(2, '0'));
                      }
                      setStep('month');
                    }
                    if (step === 'month') {
                      setMonth(item);
                      // If switching to current month and selDay > today, reset day
                      if (Number(selYear) === todayY && MONTHS.indexOf(item) === todayM && Number(selDay) > todayD) {
                        setDay(String(todayD).padStart(2, '0'));
                      }
                      setStep('day');
                    }
                    if (step === 'day') { setDay(item); confirm(item); }
                  }}>
                  <Text style={[{ fontSize: 15, color: C.text }, item === cur && { color: C.red, fontWeight: '700' }]}>{item}</Text>
                </TouchableOpacity>
              );
            }}
          />
          <TouchableOpacity style={[ui.btn, { backgroundColor: C.red, marginTop: 10 }]} onPress={onClose}>
            <Text style={ui.btnTxt}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

// Simple time picker
function TimePickerModal({ visible, value, onChange, onClose }) {
  const hours   = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
  const [selH, setH] = useState(value ? value.split(':')[0] : '08');
  const [selM, setM] = useState(value ? value.split(':')[1] : '00');
  const [step, setStep] = useState('hour');

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={ui.sheetOverlay} activeOpacity={1} onPress={onClose}>
        <View style={ui.sheet}>
          <View style={ui.sheetHandle} />
          <Text style={ui.sheetTitle}>{step === 'hour' ? 'Select Hour' : 'Select Minute'}</Text>
          <Text style={{ fontSize: 12, color: C.grey, marginBottom: 10 }}>Selected: {selH}:{selM}</Text>
          <FlatList
            data={step === 'hour' ? hours : minutes}
            keyExtractor={x => x}
            renderItem={({ item }) => {
              const cur = step === 'hour' ? selH : selM;
              return (
                <TouchableOpacity
                  style={[ui.sheetItem, item === cur && { backgroundColor: C.redLight }]}
                  onPress={() => {
                    if (step === 'hour') { setH(item); setStep('minute'); }
                    else { setM(item); onChange(`${selH}:${item}`); onClose(); setStep('hour'); }
                  }}>
                  <Text style={[{ fontSize: 15, color: C.text }, item === cur && { color: C.red, fontWeight: '700' }]}>{item}</Text>
                </TouchableOpacity>
              );
            }}
          />
          <TouchableOpacity style={[ui.btn, { backgroundColor: C.red, marginTop: 10 }]} onPress={onClose}>
            <Text style={ui.btnTxt}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

function SectionHead({ children }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12, marginTop: 4 }}>
      <View style={{ width: 4, height: 18, backgroundColor: C.red, borderRadius: 2 }} />
      <Text style={{ fontSize: 13, fontWeight: '800', color: C.red, textTransform: 'uppercase', letterSpacing: 0.6 }}>{children}</Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────
// SCREEN 1 — SPLASH
// ─────────────────────────────────────────────────────────────────
function SplashScreen({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: C.red }}>
      <StatusBar barStyle="light-content" backgroundColor={C.red} />
      {/* SA flag stripe layout */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '36%', backgroundColor: C.green }} />
      <View style={{ position: 'absolute', bottom: '34%', left: 0, right: 0, height: '5%', backgroundColor: C.yellow }} />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingHorizontal: 32, paddingTop: 40, paddingBottom: 28, alignItems: 'center' }}>
          <Image source={{ uri: LOGO_B64 }} style={{ width: 84, height: 84, borderRadius: 24, backgroundColor: 'white' }} resizeMode="contain" />
          <Text style={sp.title}>SAPS{'\n'}<Text style={{ color: C.yellow }}>Accident</Text>{'\n'}Statement</Text>
          <Text style={sp.sub}>From incident to accident statement — made easy. Create a clear, accurate SAPS accident statement step by step.</Text>
          <Text style={sp.tagline}>A FREE SERVICE BY MYLAWSA</Text>
          <View style={{ flex: 1 }} />
          
          <TouchableOpacity style={sp.btnPrimary} onPress={() => navigation.navigate('Welcome')} activeOpacity={0.85}>
            <Text style={{ color: 'white', fontSize: 17, fontWeight: '800' }}>Get Started →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={sp.btnOutline} onPress={() => navigation.navigate('Reports')} activeOpacity={0.85}>
            <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, fontWeight: '600' }}>I Have an Existing Draft</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textAlign: 'center', lineHeight: 15 }}>
            This statement has been generated based solely on information provided by the individual. The accuracy, completeness, and truthfulness of the contents remain the full responsibility of the person who supplied the information.
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}
const sp = StyleSheet.create({
  logo:      { width: 84, height: 84, backgroundColor: 'white', borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 10 },
  title:     { fontSize: 44, fontWeight: '800', color: 'white', textAlign: 'center', letterSpacing: -1, lineHeight: 50, marginBottom: 16 },
  sub:       { fontSize: 14, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 21 },
  tagline:   { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.45)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 18 },
  btnPrimary:{ width: '100%', backgroundColor: C.yellow, borderRadius: 14, paddingVertical: 17, alignItems: 'center', marginBottom: 12, shadowColor: C.yellow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 6 },
  btnOutline:{ width: '100%', borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 20 },
});

// ─────────────────────────────────────────────────────────────────
// SCREEN 2 — WELCOME & CONSENT
// ─────────────────────────────────────────────────────────────────
function WelcomeScreen({ navigation }) {
  const [consentData, setConsentData] = useState(false);
  const [consentMkt,  setConsentMkt]  = useState(false);
  return (
    <SafeAreaView style={ui.safe} edges={['bottom']}>
      <TopBar title="Welcome" subtitle="SAPS AccidentStatement" onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={ui.body}>
        <Text style={ui.heading}>Welcome</Text>
        <Text style={{ fontSize: 15, color: C.grey, lineHeight: 22, marginBottom: 18 }}>From incident to accident statement — made easy. Create clear, accurate accident statements with our simple step-by-step guidance.</Text>
        <InfoBox icon="📋">Your ID or passport, vehicle registration details, and as much information as possible about the accident and other parties involved.</InfoBox>
        <Text style={ui.secLbl}>CONSENT</Text>
        <CheckRow label="I consent to the processing of my personal data to generate an accident statement." sublabel="Required — this must be checked to continue" checked={consentData} onChange={setConsentData} />
        <CheckRow label="MyLawSA may contact me regarding legal assistance with my claim." sublabel="Optional — we can help you recover vehicle damage at no upfront cost" checked={consentMkt} onChange={setConsentMkt} />
        <Disclaimer />
      </ScrollView>
      <BottomBar>
        <BtnGhost label="← Back" onPress={() => navigation.goBack()} />
        <Btn label="Continue →" onPress={() => {
          if (!consentData) return Alert.alert('Required', 'Please tick the required consent checkbox.');
          navigation.navigate('Reports');
        }} disabled={!consentData} />
      </BottomBar>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────
// SCREEN 3 — REPORTS OVERVIEW
// ─────────────────────────────────────────────────────────────────
function ReportsScreen({ navigation }) {
  const [drafts, setDrafts] = useState([]);
  useFocusEffect(useCallback(() => { loadDrafts().then(setDrafts); }, []));

  const STATUS = {
    'In Progress': { bg: C.yellowLight, txt: C.yellow2, border: '#FFD54F' },
    'Complete':    { bg: C.greenLight,  txt: C.green,   border: '#81C784' },
  };

  return (
    <SafeAreaView style={ui.safe} edges={['bottom']}>
      <TopBar title="My Reports" subtitle="SAPS AccidentStatement" onBack={() => navigation.navigate('Splash')} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={ui.body}>
        <TouchableOpacity style={ui.newBtn} onPress={async () => { const d = createDraft(); await saveDraft(d); navigation.navigate('Details', { draft: d }); }} activeOpacity={0.85}>
          <Text style={{ color: C.yellow, fontSize: 22, fontWeight: '800' }}>+</Text>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '700', flex: 1 }}>Create New Accident Report</Text>
        </TouchableOpacity>

        {drafts.length === 0
          ? <View style={{ alignItems: 'center', paddingTop: 40 }}>
              <Text style={{ fontSize: 52, marginBottom: 14 }}>📋</Text>
              <Text style={{ fontSize: 18, fontWeight: '800', color: C.red, marginBottom: 6 }}>No reports yet</Text>
              <Text style={{ fontSize: 14, color: C.grey, textAlign: 'center', lineHeight: 20 }}>Tap the button above to create your first accident statement.</Text>
            </View>
          : <>
              <Text style={ui.secLbl}>EXISTING DRAFTS</Text>
              {drafts.map(d => {
                const ss = STATUS[d.status] || STATUS['In Progress'];
                const cr = new Date(d.createdAt);
                return (
                  <TouchableOpacity key={d.id} style={ui.draftCard} activeOpacity={0.75}
                    onPress={() => navigation.navigate(d.status === 'Complete' ? 'Preview' : 'Details', { draft: d })}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <View>
                        <Text style={{ fontSize: 16, fontWeight: '800', color: C.red }}>Report # {d.reportNumber}</Text>
                        <Text style={{ fontSize: 12, color: C.grey, marginTop: 2 }}>
                          Created: {cr.getDate()} {MONTHS[cr.getMonth()].slice(0,3)} {cr.getFullYear()} · {String(cr.getHours()).padStart(2,'0')}:{String(cr.getMinutes()).padStart(2,'0')}
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => Alert.alert('Delete Draft', 'Are you sure?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: async () => { await deleteDraft(d.id); loadDrafts().then(setDrafts); } }])}>
                        <Text style={{ color: C.grey, fontSize: 18, padding: 4 }}>✕</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={[ui.statusBadge, { backgroundColor: ss.bg, borderColor: ss.border }]}>
                      <Text style={[ui.statusTxt, { color: ss.txt }]}>{d.status}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </>
        }
      </ScrollView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────
// SCREENS 4–6 — DETAILS (Driver / Vehicle / Accident tabs)
// ─────────────────────────────────────────────────────────────────
function DetailsScreen({ navigation, route }) {
  const [draft, setDraft]   = useState(route.params.draft);
  const [tab,   setTab]     = useState(0);
  const [showRel,   setRel] = useState(false);
  const [showProv, setProv] = useState(false);
  const [showDate, setDate] = useState(false);
  const [showTime, setTime] = useState(false);

  const ud = (f, v) => setDraft(d => ({ ...d, driver:   { ...d.driver,   [f]: v } }));
  const uv = (f, v) => setDraft(d => ({ ...d, vehicle:  { ...d.vehicle,  [f]: v } }));
  const ua = (f, v) => setDraft(d => ({ ...d, accident: { ...d.accident, [f]: v } }));

  const labels = ['Step 1 of 6 · Driver', 'Step 2 of 6 · Vehicle', 'Step 3 of 6 · Accident'];

  const next = async () => {
    if (tab === 0) {
      if (!draft.driver.fullName || !draft.driver.cellOrEmail || !draft.driver.idNumber || !draft.driver.relationship)
        return Alert.alert('Required Fields', 'Please fill in all required fields marked with *.');
      if (!isValidCell(draft.driver.cellOrEmail))
        return Alert.alert('Invalid Cell Number', 'Cell number must be exactly 10 digits and contain only numbers.');
      if (!isValidID(draft.driver.idNumber))
        return Alert.alert('Invalid ID Number', 'ID number must be exactly 13 digits.');
      setTab(1);
    } else if (tab === 1) {
      if (!draft.vehicle.registration) return Alert.alert('Required Fields', 'Please enter your vehicle registration number.');
      setTab(2);
    } else {
      if (!draft.accident.date || !draft.accident.time || !draft.accident.street || !draft.accident.city)
        return Alert.alert('Required Fields', 'Please fill in all required fields marked with *.');
      if (!isNotFuture(draft.accident.date))
        return Alert.alert('Invalid Date', 'The accident date cannot be a future date.');
      await saveDraft(draft);
      navigation.navigate('Classifier', { draft });
    }
  };

  return (
    <SafeAreaView style={ui.safe} edges={['bottom']}>
      <TopBar title="Accident Details" subtitle="SAPS AccidentStatement" onBack={() => tab > 0 ? setTab(tab - 1) : navigation.goBack()} />
      <ProgressBar step={tab + 1} total={6} label={labels[tab]} />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={ui.body} keyboardShouldPersistTaps="handled">
        <Tabs tabs={['Driver', 'Vehicle', 'Accident']} active={tab} onPress={i => { if (i < tab) setTab(i); }} />

        {tab === 0 && <>
          <Field label="Full Name" required><Inp placeholder="e.g. John Dlamini" value={draft.driver.fullName} onChangeText={v => ud('fullName', v)} /></Field>
          <Field label="Cell Number" required>
            <Inp
              placeholder="e.g. 0821234567"
              value={draft.driver.cellOrEmail}
              onChangeText={v => ud('cellOrEmail', digitsOnly(v).slice(0, 10))}
              keyboardType="phone-pad"
              error={draft.driver.cellOrEmail && !isValidCell(draft.driver.cellOrEmail) ? 'Must be exactly 10 digits' : null}
            />
          </Field>
          <Field label="ID Number" required>
            <Inp
              placeholder="13-digit South African ID number"
              value={draft.driver.idNumber}
              onChangeText={v => ud('idNumber', digitsOnly(v).slice(0, 13))}
              keyboardType="phone-pad"
              error={draft.driver.idNumber && !isValidID(draft.driver.idNumber) ? 'Must be exactly 13 digits' : null}
            />
          </Field>
          <Field label="Residential Address"><Inp placeholder="Street, Suburb, City" value={draft.driver.address} onChangeText={v => ud('address', v)} /></Field>
          <Field label="Driver's Licence Number"><Inp placeholder="Licence number" value={draft.driver.licenceNumber} onChangeText={v => ud('licenceNumber', v)} /></Field>
          <Field label="Relationship to Vehicle" required><PickBtn value={draft.driver.relationship} placeholder="Select..." onPress={() => setRel(true)} /></Field>
        </>}

        {tab === 1 && <>
          <Field label="Registration Number" required><Inp placeholder="e.g. GP 123-456" value={draft.vehicle.registration} onChangeText={v => uv('registration', v)} /></Field>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Field label="Make" style={{ flex: 1 }}><Inp placeholder="e.g. Toyota" value={draft.vehicle.make} onChangeText={v => uv('make', v)} /></Field>
            <Field label="Model" style={{ flex: 1 }}><Inp placeholder="e.g. Corolla" value={draft.vehicle.model} onChangeText={v => uv('model', v)} /></Field>
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Field label="Year" style={{ flex: 1 }}><Inp placeholder="e.g. 2019" value={draft.vehicle.year} onChangeText={v => uv('year', v)} keyboardType="numeric" /></Field>
            <Field label="Colour" style={{ flex: 1 }}><Inp placeholder="e.g. Silver" value={draft.vehicle.colour} onChangeText={v => uv('colour', v)} /></Field>
          </View>
          <CheckRow label="Trailer involved?" checked={draft.vehicle.trailerInvolved} onChange={v => uv('trailerInvolved', v)} />
          {draft.vehicle.trailerInvolved && <Field label="Trailer Registration" style={{ marginTop: 10 }}><Inp placeholder="Trailer registration number" value={draft.vehicle.trailerReg} onChangeText={v => uv('trailerReg', v)} /></Field>}
        </>}

        {tab === 2 && <>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Field label="Date" required style={{ flex: 1 }}>
              <PickBtn value={draft.accident.date ? (() => { const d = new Date(draft.accident.date); return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0,3)} ${d.getFullYear()}`; })() : ''} placeholder="Select date" onPress={() => setDate(true)} />
            </Field>
            <Field label="Time" required style={{ flex: 1 }}>
              <PickBtn value={draft.accident.time} placeholder="Select time" onPress={() => setTime(true)} />
            </Field>
          </View>
          <Field label="Street / Road" required><Inp placeholder="e.g. Commissioner Street, Johannesburg" value={draft.accident.street} onChangeText={v => ua('street', v)} /></Field>
          <Field label="Nearest Landmark or Intersection"><Inp placeholder="e.g. Near KFC / Corner of Main Road" value={draft.accident.landmark} onChangeText={v => ua('landmark', v)} /></Field>
          <Field label="City / Town" required><Inp placeholder="e.g. Johannesburg" value={draft.accident.city} onChangeText={v => ua('city', v)} /></Field>
          <Field label="Province"><PickBtn value={draft.accident.province} placeholder="Select province..." onPress={() => setProv(true)} /></Field>
          <Field label="SAPS Case Number (if known)"><Inp placeholder="e.g. CAS 123/02/2025" value={draft.accident.caseNumber} onChangeText={v => ua('caseNumber', v)} /></Field>
        </>}
      </ScrollView>

      <BottomBar>
        {tab > 0 && <BtnGhost label="← Previous" onPress={() => setTab(tab - 1)} />}
        <Btn label={tab < 2 ? 'Next Section →' : 'Next →'} onPress={next} />
      </BottomBar>

      <ListPicker visible={showRel}  title="Relationship to Vehicle" options={RELATIONSHIPS} onSelect={v => ud('relationship', v)} onClose={() => setRel(false)}  />
      <ListPicker visible={showProv} title="Province"               options={PROVINCES}     onSelect={v => ua('province', v)}     onClose={() => setProv(false)} />
      <DatePickerModal visible={showDate} value={draft.accident.date}  onChange={v => ua('date', v)} onClose={() => setDate(false)} />
      <TimePickerModal visible={showTime} value={draft.accident.time}  onChange={v => ua('time', v)} onClose={() => setTime(false)} />
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────
// SCREEN 7 — CLASSIFIER (Q1–Q15)
// ─────────────────────────────────────────────────────────────────
function ClassifierScreen({ navigation, route }) {
  const [draft,   setDraft]   = useState(route.params.draft);
  const [curId,   setCurId]   = useState(1);
  const [history, setHistory] = useState([]);
  const q = QUESTIONS.find(x => x.id === curId);

  const answer = (yes) => {
    if (!q) return;
    const result  = yes ? q.yes : q.no;
    const updated = { ...draft, classifierAnswers: { ...draft.classifierAnswers, [curId]: yes ? 'y' : 'n' } };
    setDraft(updated);
    setHistory(h => [...h, curId]);
    if (typeof result === 'number') { setCurId(result); }
    else { navigation.navigate('Outcome', { draft: { ...updated, accidentKey: result } }); }
  };

  const back = () => {
    if (history.length > 0) { setCurId(history[history.length - 1]); setHistory(h => h.slice(0, -1)); }
    else navigation.goBack();
  };

  if (!q) return null;
  return (
    <SafeAreaView style={ui.safe} edges={['bottom']}>
      <TopBar title="Classify Accident" subtitle={`Question ${curId} of ${QUESTIONS.length}`} onBack={back} />
      <ProgressBar step={curId} total={QUESTIONS.length} label={`Q${curId} / ${QUESTIONS.length}`} />
      <View style={{ flex: 1, padding: 24 }}>
        <View style={cl.card}>
          <View style={cl.badge}><Text style={{ color: 'white', fontSize: 12, fontWeight: '700' }}>Q{curId}</Text></View>
          <Text style={cl.qTxt}>{q.text}</Text>
          {q.hint ? <Text style={cl.hint}>{q.hint}</Text> : null}
        </View>
        <View style={{ flexDirection: 'row', gap: 14, marginBottom: 20 }}>
          <TouchableOpacity style={[cl.ansBtn, { backgroundColor: C.greyLight, borderWidth: 1.5, borderColor: C.border }]} onPress={() => answer(false)} activeOpacity={0.8}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: C.grey }}>No</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[cl.ansBtn, { backgroundColor: C.green, shadowColor: C.green, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 }]} onPress={() => answer(true)} activeOpacity={0.8}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: 'white' }}>Yes</Text>
          </TouchableOpacity>
        </View>
        <InfoBox>Answer each question honestly. The more accurate your answers, the better your statement will be.</InfoBox>
      </View>
    </SafeAreaView>
  );
}
const cl = StyleSheet.create({
  card:  { backgroundColor: 'white', borderRadius: 16, borderWidth: 1.5, borderColor: C.border, padding: 24, marginBottom: 24, shadowColor: C.red, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  badge: { backgroundColor: C.red, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start', marginBottom: 14 },
  qTxt:  { fontSize: 20, fontWeight: '800', color: C.text, letterSpacing: -0.3, lineHeight: 28, marginBottom: 8 },
  hint:  { fontSize: 13, color: C.grey, lineHeight: 18, fontStyle: 'italic' },
  ansBtn:{ flex: 1, paddingVertical: 24, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});

// ─────────────────────────────────────────────────────────────────
// SCREENS 8A–8M — OUTCOME + FOLLOW-UPS
// ─────────────────────────────────────────────────────────────────
function OutcomeScreen({ navigation, route }) {
  const [draft, setDraft]   = useState(route.params.draft);
  const [sub,   setSub]     = useState(route.params.draft.subAnswers || {});
  const outcome = OUTCOMES[draft.accidentKey] || OUTCOMES.NOT_CLASSIFIABLE;
  const set = (id, val) => setSub(s => ({ ...s, [id]: val }));

  return (
    <SafeAreaView style={ui.safe} edges={['bottom']}>
      <TopBar title="Accident Classified" subtitle="Answer follow-up questions" onBack={() => navigation.goBack()} />
      <ProgressBar step={4} total={6} label="Step 4 of 6 · Accident Type" />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={ui.body}>
        <Banner
          claimable={outcome.claimable} label={outcome.label}
          description={outcome.claimable ? 'This accident type may be claimable. MyLawSA can assist you with recovery at no upfront cost.' : 'This incident type is generally not insurable or claimable as a third-party claim.'}
        />
        {outcome.subQs?.length > 0 && <>
          <View style={ui.card}>
            <Text style={ui.cardTitle}>Follow-up Questions</Text>
            <Text style={{ fontSize: 13, color: C.grey, lineHeight: 18 }}>Please answer the questions below to complete your accident classification.</Text>
          </View>
          {outcome.subQs.map(sq => {
            if (sq.conditionalOn && sub[sq.conditionalOn] !== 'y') return null;
            return (
              <View key={sq.id} style={ui.subCard}>
                <Text style={ui.subTxt}>{sq.label}</Text>
                {sq.type === 'ynu' && <YNU value={sub[sq.id]} onChange={v => set(sq.id, v)} />}
                {(sq.type === 'text' || sq.type === 'textarea') && <Inp placeholder={sq.placeholder} value={sub[sq.id] || ''} onChangeText={v => set(sq.id, v)} multiline={sq.type === 'textarea'} numberOfLines={sq.type === 'textarea' ? 4 : 1} style={{ marginTop: 8 }} />}
              </View>
            );
          })}
        </>}
        {outcome.key === 'NOT_CLASSIFIABLE' && <InfoBox>The accident could not be matched to a known type. The statement may still be generated using the general template, but a NOMS recovery claim may not be possible.</InfoBox>}
      </ScrollView>
      <BottomBar>
        <BtnGhost label="← Back" onPress={() => navigation.goBack()} />
        <Btn label="Next: Other Parties →" onPress={async () => { const u = { ...draft, subAnswers: sub }; await saveDraft(u); navigation.navigate('OtherParties', { draft: u }); }} />
      </BottomBar>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────
// SCREEN 9 — OTHER PARTIES
// ─────────────────────────────────────────────────────────────────
function OtherPartiesScreen({ navigation, route }) {
  const [draft, setDraft] = useState({ ...route.params.draft, otherParties: route.params.draft.otherParties?.length > 0 ? route.params.draft.otherParties : [{}], witnesses: route.params.draft.witnesses || [] });

  const updP = (i, val) => setDraft(d => { const p = [...d.otherParties]; p[i] = val; return { ...d, otherParties: p }; });
  const updW = (i, val) => setDraft(d => { const w = [...d.witnesses];    w[i] = val; return { ...d, witnesses:    w }; });

  return (
    <SafeAreaView style={ui.safe} edges={['bottom']}>
      <TopBar title="Other Parties" subtitle="Drivers & Witnesses" onBack={() => navigation.goBack()} />
      <ProgressBar step={5} total={6} label="Step 5 of 6 · Other Parties" />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={ui.body}>
        <InfoBox icon="💡">The more details you provide, the more complete your statement will be — and the better your chances of recovering accident damage.</InfoBox>
        <SectionHead>Other Driver(s)</SectionHead>
        {draft.otherParties.map((p, i) => (
          <View key={i} style={ui.partyCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 15, fontWeight: '800', color: C.red }}>Other Driver {i + 1}</Text>
              {i > 0 && <TouchableOpacity onPress={() => setDraft(d => ({ ...d, otherParties: d.otherParties.filter((_, j) => j !== i) }))}><Text style={{ color: C.red, fontSize: 13, fontWeight: '700' }}>Remove</Text></TouchableOpacity>}
            </View>
            <Field label="Name & Surname"><Inp placeholder="Full name" value={p.name || ''} onChangeText={v => updP(i, { ...p, name: v })} /></Field>
            <Field label="Contact Number">
              <Inp
                placeholder="e.g. 0821234567"
                value={p.contact || ''}
                onChangeText={v => updP(i, { ...p, contact: digitsOnly(v).slice(0, 10) })}
                keyboardType="phone-pad"
                error={p.contact && !isValidCell(p.contact) ? 'Must be exactly 10 digits' : null}
              />
            </Field>
            <Field label="ID Number (13 digits) / Passport / Licence">
              <Inp
                placeholder="13-digit ID, Passport, or Licence number"
                value={p.idNumber || ''}
                onChangeText={v => updP(i, { ...p, idNumber: digitsOnly(v).slice(0, 13) })}
                keyboardType="phone-pad"
                error={p.idNumber && p.idNumber.length === 13 && !isValidID(p.idNumber) ? 'Must be exactly 13 digits' : null}
              />
            </Field>
            <Field label="Vehicle Registration"><Inp placeholder="e.g. GP 456-789" value={p.registration || ''} onChangeText={v => updP(i, { ...p, registration: v })} /></Field>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Field label="Make" style={{ flex: 1 }}><Inp placeholder="e.g. BMW" value={p.make || ''} onChangeText={v => updP(i, { ...p, make: v })} /></Field>
              <Field label="Model" style={{ flex: 1 }}><Inp placeholder="e.g. 3 Series" value={p.model || ''} onChangeText={v => updP(i, { ...p, model: v })} /></Field>
            </View>
            <Field label="Vehicle Colour"><Inp placeholder="e.g. White" value={p.colour || ''} onChangeText={v => updP(i, { ...p, colour: v })} /></Field>
            <CheckRow label="Insurance known?" checked={p.insuranceKnown || false} onChange={v => updP(i, { ...p, insuranceKnown: v })} />
          </View>
        ))}
        <TouchableOpacity style={ui.addBtn} onPress={() => setDraft(d => ({ ...d, otherParties: [...d.otherParties, {}] }))}>
          <Text style={ui.addBtnTxt}>+ Add Another Driver / Party</Text>
        </TouchableOpacity>
        <View style={{ height: 1, backgroundColor: C.border, marginVertical: 16 }} />
        <SectionHead>Witnesses</SectionHead>
        {draft.witnesses.length === 0 && <Text style={{ color: C.grey, fontSize: 13, marginBottom: 10 }}>No witnesses added yet.</Text>}
        {draft.witnesses.map((w, i) => (
          <View key={i} style={ui.partyCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 15, fontWeight: '800', color: C.red }}>Witness {i + 1}</Text>
              {i > 0 && <TouchableOpacity onPress={() => setDraft(d => ({ ...d, witnesses: d.witnesses.filter((_, j) => j !== i) }))}><Text style={{ color: C.red, fontSize: 13, fontWeight: '700' }}>Remove</Text></TouchableOpacity>}
            </View>
            <Field label="Witness Name"><Inp placeholder="Full name of witness" value={w.name || ''} onChangeText={v => updW(i, { ...w, name: v })} /></Field>
            <Field label="Contact Number">
              <Inp
                placeholder="e.g. 0821234567"
                value={w.contact || ''}
                onChangeText={v => updW(i, { ...w, contact: digitsOnly(v).slice(0, 10) })}
                keyboardType="phone-pad"
                error={w.contact && !isValidCell(w.contact) ? 'Must be exactly 10 digits' : null}
              />
            </Field>
          </View>
        ))}
        <TouchableOpacity style={ui.addBtn} onPress={() => setDraft(d => ({ ...d, witnesses: [...d.witnesses, {}] }))}>
          <Text style={ui.addBtnTxt}>+ Add Another Witness</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomBar>
        <BtnGhost label="← Back" onPress={() => navigation.goBack()} />
        <Btn label="Continue →" onPress={async () => { await saveDraft(draft); navigation.navigate('Generate', { draft }); }} />
      </BottomBar>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────
// SCREEN 10 — GENERATE
// ─────────────────────────────────────────────────────────────────
function GenerateScreen({ navigation, route }) {
  const { draft } = route.params;
  const [busy, setBusy] = useState(false);
  const outcome = OUTCOMES[draft.accidentKey] || {};
  const items = [
    { l: 'Driver details',               ok: !!draft.driver.fullName        },
    { l: 'Vehicle details',              ok: !!draft.vehicle.registration   },
    { l: 'Accident date and location',   ok: !!(draft.accident.date && draft.accident.street) },
    { l: 'Accident type classification', ok: !!draft.accidentKey            },
    { l: 'Other parties',                ok: !!draft.otherParties?.[0]?.name},
  ];

  return (
    <SafeAreaView style={ui.safe} edges={['bottom']}>
      <TopBar title="Generate Statement" subtitle="Review & Generate" onBack={() => navigation.goBack()} />
      <ProgressBar step={6} total={6} label="Step 6 of 6 · Generate" />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={ui.body}>
        <View style={{ backgroundColor: C.greenLight, borderRadius: 14, borderWidth: 1.5, borderColor: '#81C784', padding: 16, marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '800', color: C.green, marginBottom: 12 }}>✅ Information Captured</Text>
          {items.map((it, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Text style={{ color: it.ok ? C.green : C.grey, fontWeight: '700', fontSize: 14, width: 18 }}>{it.ok ? '✓' : '○'}</Text>
              <Text style={{ color: it.ok ? C.green2 : C.grey, fontSize: 13 }}>{it.l}</Text>
            </View>
          ))}
        </View>
        {draft.accidentKey && (
          <View style={ui.card}>
            <Text style={ui.cardTitle}>Classified As</Text>
            <Text style={{ fontSize: 16, fontWeight: '800', color: C.red, marginTop: 4, marginBottom: 4 }}>{outcome.icon} {outcome.label}</Text>
            <Text style={{ fontSize: 12, color: C.grey }}>{outcome.claimable ? '✅ May be claimable' : '⚠️ Generally not claimable'}</Text>
          </View>
        )}
        <Disclaimer />
        <View style={{ backgroundColor: C.greyLight, borderRadius: 10, padding: 12 }}>
          <Text style={{ fontSize: 12, color: C.grey, textAlign: 'center', fontStyle: 'italic', lineHeight: 17 }}>Statements are generated using accident-type-specific templates. No AI is used in generation.</Text>
        </View>
      </ScrollView>
      <BottomBar>
        <BtnGhost label="← Back" onPress={() => navigation.goBack()} />
        <Btn label={busy ? '⏳ Generating...' : '📄 Generate Draft Statement'} color={C.yellow} onPress={() => {
          setBusy(true);
          setTimeout(async () => {
            const statementText = buildStatement(draft);
            const updated = { ...draft, statementText, status: 'Complete' };
            await saveDraft(updated);
            setBusy(false);
            navigation.navigate('Preview', { draft: updated });
          }, 800);
        }} disabled={busy} />
      </BottomBar>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────
// SCREEN 11 — PREVIEW
// ─────────────────────────────────────────────────────────────────
function PreviewScreen({ navigation, route }) {
  const { draft } = route.params;
  return (
    <SafeAreaView style={ui.safe} edges={['bottom']}>
      <TopBar title="Draft Preview" subtitle="SAPS Accident Statement" onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={ui.body}>
        <Disclaimer />
        <View style={{ backgroundColor: 'white', borderRadius: 14, borderWidth: 1.5, borderColor: C.border, overflow: 'hidden' }}>
          <View style={{ backgroundColor: C.red, paddingVertical: 14, paddingHorizontal: 20 }}>
            <Text style={{ color: 'white', fontSize: 13, fontWeight: '700', letterSpacing: 1.5, textAlign: 'center' }}>ACCIDENT STATEMENT</Text>
          </View>
          <Text style={{ padding: 20, fontSize: 13, color: C.text, lineHeight: 20, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }}>{draft.statementText}</Text>
        </View>
      </ScrollView>
      <BottomBar>
        <BtnGhost label="← Back" onPress={() => navigation.goBack()} />
        <Btn label="Edit Statement →" onPress={() => navigation.navigate('Edit', { draft })} />
      </BottomBar>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────
// SCREEN 12 — EDIT
// ─────────────────────────────────────────────────────────────────
function EditScreen({ navigation, route }) {
  const [text,      setText]     = useState(route.params.draft.statementText);
  const [confirmed, setConfirmed] = useState(false);
  return (
    <SafeAreaView style={ui.safe} edges={['bottom']}>
      <TopBar title="Edit Statement" subtitle="Make corrections before saving" onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={ui.body} keyboardShouldPersistTaps="handled">
        <Disclaimer />
        <View style={{ backgroundColor: 'white', borderRadius: 14, borderWidth: 1.5, borderColor: C.border, overflow: 'hidden', marginBottom: 16 }}>
          <View style={{ backgroundColor: C.red, paddingVertical: 12, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: 'white', fontSize: 12, fontWeight: '700', letterSpacing: 1.5 }}>EDITABLE STATEMENT</Text>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Tap to edit</Text>
          </View>
          <TextInput style={{ padding: 18, fontSize: 13, color: C.text, lineHeight: 21, minHeight: 400, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', textAlignVertical: 'top' }} value={text} onChangeText={setText} multiline autoCorrect={false} spellCheck={false} />
        </View>
        <CheckRow label="I confirm this statement is truthful to the best of my knowledge." checked={confirmed} onChange={setConfirmed} />
      </ScrollView>
      <BottomBar>
        <BtnGhost label="← Back" onPress={() => navigation.goBack()} />
        <Btn label="Save & Continue →" onPress={async () => {
          if (!confirmed) return Alert.alert('Confirmation Required', 'Please confirm the statement is truthful.');
          const updated = { ...route.params.draft, statementText: text, status: 'Complete' };
          await saveDraft(updated);
          navigation.navigate('Export', { draft: updated });
        }} />
      </BottomBar>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────
// SCREEN 13 — EXPORT
// ─────────────────────────────────────────────────────────────────
function ExportScreen({ navigation, route }) {
  const { draft } = route.params;
  const [busy, setBusy] = useState(false);

  const buildHtml = () => `
    <html><body style="font-family:monospace;padding:32px;font-size:13px;line-height:1.6;">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:8px;">
        <img src="data:image/png;base64,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" style="width:60px;height:60px;object-fit:contain;" />
        <div>
          <h2 style="font-family:sans-serif;color:#C62828;margin:0 0 2px;">SAPS Accident Statement</h2>
          <p style="font-family:sans-serif;color:#888;margin:0;font-size:11px;letter-spacing:1px;">A FREE SERVICE BY MYLAWSA</p>
        </div>
      </div>
      <hr style="border:none;border-top:2px solid #C62828;margin-bottom:24px;"/>
      <pre style="white-space:pre-wrap;font-family:monospace;font-size:13px;line-height:1.7;">${draft.statementText}</pre>
      <hr style="border:none;border-top:1px solid #ddd;margin-top:48px;margin-bottom:12px;"/>
      <p style="font-family:sans-serif;font-size:9px;color:#aaa;line-height:1.6;font-style:italic;text-align:center;">
        This statement was generated using the SAPS AccidentStatement tool, a free service provided by MyLawSA. The accuracy, completeness, and truthfulness of the contents of this statement are the sole responsibility of the person who provided the information. MyLawSA, its directors, employees, and agents accept no liability whatsoever for any inaccurate, false, or misleading information contained herein. This document does not constitute legal advice.
      </p>
    </body></html>`;

  const handleShare = async () => {
    try {
      setBusy(true);
      const { uri } = await Print.printToFileAsync({ html: buildHtml() });
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Share your accident statement' });
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setBusy(false);
    }
  };

  const handlePrint = async () => {
    try {
      await Print.printAsync({ html: buildHtml() });
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  const ExCard = ({ icon, title, sub, accent, onPress }) => (
    <TouchableOpacity style={[{ flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 14, borderWidth: 1.5, padding: 18, marginBottom: 12 }, accent ? { backgroundColor: C.red, borderColor: C.red } : { backgroundColor: 'white', borderColor: C.border }]} onPress={onPress} activeOpacity={0.8}>
      <Text style={{ fontSize: 28 }}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: accent ? 'white' : C.text, marginBottom: 3 }}>{title}</Text>
        <Text style={{ fontSize: 13, color: accent ? 'rgba(255,255,255,0.65)' : C.grey }}>{sub}</Text>
      </View>
      <Text style={{ color: accent ? 'rgba(255,255,255,0.5)' : C.grey, fontSize: 22 }}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={ui.safe} edges={['bottom']}>
      <TopBar title="Export Options" subtitle="Share or save your statement" onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={ui.body}>
        <Text style={{ fontSize: 15, color: C.grey, lineHeight: 22, marginBottom: 20 }}>Your statement is ready. Generate a PDF and share or print it.</Text>
        <ExCard icon="📤" title="Share PDF" sub="Send via WhatsApp, Email, or any app" accent onPress={handleShare} />
        <ExCard icon="🖨️" title="Print Statement" sub="Open the print dialog on your device" onPress={handlePrint} />
        <Disclaimer />
        <View style={{ backgroundColor: C.redLight, borderRadius: 14, borderWidth: 1.5, borderColor: '#FFCDD2', padding: 20 }}>
          <Text style={{ fontSize: 26, marginBottom: 8 }}>💼</Text>
          <Text style={{ fontSize: 16, fontWeight: '800', color: C.red, marginBottom: 8, lineHeight: 22 }}>Can we help recover your damages?</Text>
          <Text style={{ fontSize: 13, color: C.grey, lineHeight: 19, marginBottom: 8 }}>MyLawSA specialises in recovering vehicle accident damage (NOMS) from the at-fault driver — at no upfront cost to you.</Text>
          <Text style={{ fontSize: 14, fontWeight: '800', color: C.red }}>No Success. No Fee.</Text>
        </View>
      </ScrollView>
      <BottomBar>
        <BtnGhost label="← Back" onPress={() => navigation.goBack()} />
        <Btn label={busy ? '⏳ Generating...' : 'Continue →'} onPress={() => navigation.navigate('Assistance', { draft })} disabled={busy} />
      </BottomBar>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────
// SCREEN 14 — MYLAWSA + SCREEN 15 SUCCESS MODAL
// ─────────────────────────────────────────────────────────────────
function AssistanceScreen({ navigation, route }) {
  const { draft } = route.params;
  const [consent, setConsent] = useState(draft.consentMyLawSA || false);
  const [done,    setDone]    = useState(false);
  return (
    <SafeAreaView style={ui.safe} edges={['bottom']}>
      <TopBar title="MyLawSA Assistance" subtitle="Optional" onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={ui.body}>
        <View style={{ backgroundColor: C.red, borderRadius: 18, padding: 24, marginBottom: 16 }}>
          <Text style={{ fontSize: 38, marginBottom: 14 }}>🏛️</Text>
          <Text style={{ fontSize: 22, fontWeight: '800', color: 'white', letterSpacing: -0.4, marginBottom: 10 }}>Recover Your Vehicle Damage</Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 21, marginBottom: 16 }}>My Law SA is a registered debt collector that recovers uninsured motor accident damage (NOMS) on your behalf — from the party at fault.</Text>
          <View style={{ backgroundColor: C.yellow, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 7, alignSelf: 'flex-start' }}>
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '800' }}>No upfront cost to you.</Text>
          </View>
        </View>
        <View style={{ backgroundColor: C.greenLight, borderRadius: 14, borderWidth: 1.5, borderColor: '#81C784', padding: 16, marginBottom: 20 }}>
          <Text style={{ fontSize: 12, fontWeight: '800', color: C.green, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>✅ How it works</Text>
          {['We send a formal demand to the at-fault driver.', 'The defendant pays our 10% handling commission.', 'You receive your damage recovery minus our success fee.', 'Zero risk to you.'].map((t, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
              <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
                <Text style={{ color: 'white', fontSize: 11, fontWeight: '700' }}>{i + 1}</Text>
              </View>
              <Text style={{ flex: 1, fontSize: 13, color: C.green2, lineHeight: 19 }}>{t}</Text>
            </View>
          ))}
        </View>
        <Text style={{ fontSize: 14, fontWeight: '700', color: C.text, marginBottom: 10 }}>Would you like MyLawSA to contact you?</Text>
        <CheckRow label="Yes, MyLawSA may contact me regarding assistance with recovering my vehicle damage." sublabel="We will use your details submitted during this session" checked={consent} onChange={setConsent} />
      </ScrollView>
      <BottomBar>
        <BtnGhost label="← Back" onPress={() => navigation.goBack()} />
        <Btn label="Finish ✓" onPress={async () => { await saveDraft({ ...draft, consentMyLawSA: consent, status: 'Complete' }); setDone(true); }} />
      </BottomBar>

      {/* Screen 15 — Success */}
      <Modal visible={done} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <View style={{ backgroundColor: 'white', borderRadius: 24, padding: 32, alignItems: 'center', width: '100%', maxWidth: 380, shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.3, shadowRadius: 24, elevation: 12 }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: C.greenLight, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 38 }}>✅</Text>
            </View>
            <Text style={{ fontSize: 30, fontWeight: '800', color: C.text, letterSpacing: -0.5, marginBottom: 12 }}>Done!</Text>
            <Text style={{ fontSize: 15, color: C.text, textAlign: 'center', lineHeight: 22, marginBottom: 8 }}>Your report has been completed. Your SAPS accident statement is ready.</Text>
            <Text style={{ fontSize: 13, color: C.grey, textAlign: 'center', lineHeight: 19, marginBottom: 28 }}>If you consented, a MyLawSA consultant will be in touch shortly.</Text>
            <TouchableOpacity style={{ backgroundColor: C.red, borderRadius: 14, paddingVertical: 16, width: '100%', alignItems: 'center' }} onPress={() => { setDone(false); navigation.navigate('Splash'); }} activeOpacity={0.85}>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '800' }}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────
// SHARED STYLESHEET
// ─────────────────────────────────────────────────────────────────
const ui = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: C.bg },
  body:        { padding: 24, paddingBottom: 16 },
  heading:     { fontSize: 28, fontWeight: '800', color: C.red, letterSpacing: -0.5, marginBottom: 10 },
  secLbl:      { fontSize: 11, fontWeight: '700', color: C.grey, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10 },

  topBar:      { backgroundColor: C.red, paddingTop: 52, paddingBottom: 14, paddingHorizontal: 20 },
  topBarRow:   { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn:     { width: 36, height: 36, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 4 },
  backBtnTxt:  { color: 'white', fontSize: 26, lineHeight: 30, marginTop: -2 },
  logoBox:     { width: 36, height: 36, backgroundColor: C.yellow, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  logoTxt:     { color: 'white', fontSize: 18 },
  barTitle:    { color: 'white', fontSize: 17, fontWeight: '700', letterSpacing: -0.2 },
  barSub:      { color: 'rgba(255,255,255,0.55)', fontSize: 11, marginTop: 1 },

  progressWrap:  { backgroundColor: C.red, paddingHorizontal: 20, paddingBottom: 14 },
  progressTrack: { height: 3, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2, overflow: 'hidden' },
  progressFill:  { height: '100%', backgroundColor: C.yellow, borderRadius: 2 },
  progressLbl:   { color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 6, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },

  fieldLbl:    { fontSize: 11, fontWeight: '700', color: C.grey, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 },
  inp:         { backgroundColor: C.greyLight, borderWidth: 1.5, borderColor: C.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: C.text },

  checkRow:    { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 14, backgroundColor: C.greyLight, borderRadius: 12, borderWidth: 1.5, borderColor: C.border, marginBottom: 10 },
  checkBox:    { width: 20, height: 20, borderRadius: 5, borderWidth: 1.5, borderColor: C.border, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  checkLbl:    { fontSize: 14, color: C.text, lineHeight: 20, flex: 1 },

  btn:         { flex: 1, paddingVertical: 15, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  btnTxt:      { color: 'white', fontSize: 15, fontWeight: '700' },
  bottomBar:   { flexDirection: 'row', gap: 10, padding: 16, paddingBottom: 28, backgroundColor: C.white, borderTopWidth: 1, borderTopColor: C.border },

  infoBox:     { flexDirection: 'row', gap: 10, alignItems: 'flex-start', backgroundColor: C.greyLight, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: C.yellow, padding: 14, marginBottom: 16 },
  disclaimer:  { backgroundColor: C.yellowLight, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: C.yellow, padding: 14, marginBottom: 16 },
  disclaimerTitle: { fontSize: 11, fontWeight: '700', color: C.yellow2, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 },
  disclaimerTxt:   { fontSize: 12, color: C.yellow2, lineHeight: 18 },

  banner:      { flexDirection: 'row', alignItems: 'flex-start', gap: 12, borderRadius: 12, borderWidth: 1.5, padding: 16, marginBottom: 16 },
  bannerTitle: { fontSize: 15, fontWeight: '800', marginBottom: 4 },
  bannerSub:   { fontSize: 12, lineHeight: 17 },

  tabs:        { flexDirection: 'row', backgroundColor: C.greyLight, borderRadius: 12, padding: 4, marginBottom: 20 },
  tabBtn:      { flex: 1, paddingVertical: 9, borderRadius: 9, alignItems: 'center' },

  sheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet:        { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '70%' },
  sheetHandle:  { width: 40, height: 4, backgroundColor: C.border, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  sheetTitle:   { fontSize: 16, fontWeight: '700', color: C.text, marginBottom: 12 },
  sheetItem:    { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },

  card:        { backgroundColor: 'white', borderRadius: 14, borderWidth: 1.5, borderColor: C.border, padding: 16, marginBottom: 14 },
  cardTitle:   { fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 4 },

  subCard:     { backgroundColor: 'white', borderRadius: 12, borderWidth: 1.5, borderColor: C.border, padding: 14, marginBottom: 10 },
  subTxt:      { fontSize: 14, fontWeight: '600', color: C.text, marginBottom: 8, lineHeight: 20 },

  newBtn:      { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.red, borderRadius: 14, padding: 18, marginBottom: 24, shadowColor: C.red, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 5 },
  draftCard:   { backgroundColor: 'white', borderRadius: 14, borderWidth: 1.5, borderColor: C.border, padding: 16, marginBottom: 12 },
  statusBadge: { alignSelf: 'flex-start', borderRadius: 8, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4 },
  statusTxt:   { fontSize: 12, fontWeight: '700' },

  partyCard:   { backgroundColor: 'white', borderRadius: 14, borderWidth: 1.5, borderColor: C.border, padding: 16, marginBottom: 12 },
  addBtn:      { borderWidth: 1.5, borderColor: C.red, borderStyle: 'dashed', borderRadius: 12, padding: 14, alignItems: 'center', marginBottom: 12 },
  addBtnTxt:   { color: C.red, fontSize: 14, fontWeight: '700' },
});

// ─────────────────────────────────────────────────────────────────
// NAVIGATION + ROOT
// ─────────────────────────────────────────────────────────────────
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor={C.red} />
        <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.bg } }} initialRouteName="Splash">
          <Stack.Screen name="Splash"       component={SplashScreen}       />
          <Stack.Screen name="Welcome"      component={WelcomeScreen}      />
          <Stack.Screen name="Reports"      component={ReportsScreen}      />
          <Stack.Screen name="Details"      component={DetailsScreen}      />
          <Stack.Screen name="Classifier"   component={ClassifierScreen}   />
          <Stack.Screen name="Outcome"      component={OutcomeScreen}      />
          <Stack.Screen name="OtherParties" component={OtherPartiesScreen} />
          <Stack.Screen name="Generate"     component={GenerateScreen}     />
          <Stack.Screen name="Preview"      component={PreviewScreen}      />
          <Stack.Screen name="Edit"         component={EditScreen}         />
          <Stack.Screen name="Export"       component={ExportScreen}       />
          <Stack.Screen name="Assistance"   component={AssistanceScreen}   />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
