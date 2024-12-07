<template>
  <div>
    <v-switch
      v-model="useNotification"
      :label="'알림 사용'"
      @change="handleNotificationChange"
    />
  </div>
</template>

<script>
import { subscribeToPushNotifications } from '@/utils/push-notification';

export default {
  name: 'NotificationToggle',
  props: {
    kakaoId: {
      type: String,
      required: true
    },
    initialValue: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      useNotification: this.initialValue
    }
  },
  methods: {
    async handleNotificationChange(value) {
      if (value) {
        try {
          await subscribeToPushNotifications(this.kakaoId);
          this.$emit('update:modelValue', true);
        } catch (error) {
          this.useNotification = false;
          alert('알림 설정에 실패했습니다. 브라우저 알림 권한을 확인해주세요.');
        }
      }
    }
  }
}
</script>