<template>
    <div class="pairing">
        <div
            ref="qrcode"
            class="qrcode"
            v-if="qrLoaded"
        ></div>
        <div
            class="loader"
            v-if="!qrLoaded"
        >
            <div class="spinner"></div>
        </div>
        <p class="desc">
            Scan the QR code from the Swing Music app to pair with this server.
        </p>

        <div class="serverurl rounded">{{ url }}</div>
    </div>
</template>

<script setup lang="ts">
import { Ref, onMounted, ref } from 'vue'
import QRCodeStyling from 'qr-code-styling'
import { sendPairRequest } from '@/requests/auth'

const qrLoaded = ref(false)
// @ts-expect-error
const qrcode: Ref<HTMLElement> = ref(null)
const url = window.location.origin

async function renderQrCode(code: string) {
    const data = window.location.origin + ' ' + code
    const qrCode = new QRCodeStyling({
        width: 300,
        height: 300,
        type: 'svg',
        data: data,
        image: '/logo-fill.light.svg',
        dotsOptions: {
            color: '#fff',
            type: 'extra-rounded',
        },
        backgroundOptions: {
            color: 'transparent',
        },
        imageOptions: {
            crossOrigin: 'anonymous',
            margin: 20,
        },
        margin: 20,
    })
    const svgBlob = await qrCode.getRawData('svg')
    if (!svgBlob) return
    const img = document.createElement('img')
    img.src = URL.createObjectURL(svgBlob)
    qrcode.value.appendChild(img)
}

onMounted(async () => {
    const res = await sendPairRequest()

    if (res.status == 200) {
        qrLoaded.value = true
        return renderQrCode(res.data.code)
    }

    const error = document.createElement('p')
    error.innerHTML = 'Error fetching pairing code. Error code: ' + res.status
    qrcode.value.appendChild(error)
})
</script>

<style lang="scss">
.pairing {
    text-align: center;

    .qrcode,
    .loader {
        height: 300px;
    }

    .loader {
        display: grid;
        place-items: center;
    }

    .spinner {
        border-color: transparent;
        border-top-color: $gray1;
        margin: 0 auto;
    }

    .serverurl {
        // background-color: $orange;
        width: fit-content;
        margin: 0 auto;
        padding: $smaller;
        font-size: 12px;
        font-family: 'SF Mono';
        color: $orange;
    }
}
</style>
