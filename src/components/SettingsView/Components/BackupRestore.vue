<template>
    <div class="backup-restore">
        <button class="backupnow" @click="doBackup">{{ t('Settings.Backup.Title') }}</button>
        <div class="separator"></div>
        <h4>{{ t('Settings.Backup.RestoreBackup') }}</h4>
        <div class="helptext">
            {{ t('Settings.Backup.BackupCount', { count: backups.length }) }}
        </div>
        <div></div>
        <br />
        <div class="itemlist">
            <div class="item rounded-sm" v-for="backup in backups" :key="backup.name">
                <div class="texts">
                    <div class="item__info">
                        <div class="item__date">
                            {{ backup.date }}

                            <!-- <span class="item__name">{{ backup.name }}</span> -->
                        </div>
                    </div>
                    <div class="item__stats">
                        <div class="item__playlists">
                            {{ (backup.playlists !== 1 ? t('Settings.Backup.PlaylistCountPlural', { count: backup.playlists }) : t('Settings.Backup.PlaylistCount', { count: backup.playlists })) }}
                        </div>
                        •
                        <div class="item__scrobbles">
                            {{ (backup.scrobbles !== 1 ? t('Settings.Backup.ScrobbleCountPlural', { count: backup.scrobbles }) : t('Settings.Backup.ScrobbleCount', { count: backup.scrobbles })) }}
                        </div>
                        •
                        <div class="item__favorites">
                            {{ (backup.favorites !== 1 ? t('Settings.Backup.FavoriteCountPlural', { count: backup.favorites }) : t('Settings.Backup.FavoriteCount', { count: backup.favorites })) }}
                        </div>
                        •
                        <div class="item__collections">
                            {{ (backup.collections !== 1 ? t('Settings.Backup.CollectionCountPlural', { count: backup.collections }) : t('Settings.Backup.CollectionCount', { count: backup.collections })) }}
                        </div>
                    </div>
                </div>
                <div class="buttons">
                    <DeleteSvg @click="() => deleteBackup(backup.name)" />
                    <button class="restore" @click="() => restore(backup.name)">{{ t('Settings.Backup.RestoreButton') }}</button>
                </div>
            </div>
        </div>
        <button class="restore-all" @click="() => restore()">{{ t('Settings.Backup.RestoreAllButton') }}</button>
    </div>
</template>

<script setup lang="ts">
import { backupNow, getBackups, restoreBackup, deleteBackup as deleteBackupReq } from '@/requests/settings'
import { onMounted, ref } from 'vue'
import { useToast } from '@/stores/notification'
import DeleteSvg from '@/assets/icons/delete.svg'
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const toast = useToast()

interface Backup {
    name: string
    playlists: number
    scrobbles: number
    favorites: number
    collections: number
    date: string
}
const backups = ref<Backup[]>([])

onMounted(async () => {
    backups.value = await getBackups()
})

async function doBackup() {
    const res = await backupNow()

    if (res.status === 200) {
        toast.showSuccess('Backup created')
        backups.value.unshift(res.data)
    } else {
        toast.showError(res.data.msg)
    }
}

async function restore(backup_dir?: string) {
    const res = await restoreBackup(backup_dir)

    if (res.status === 200) {
        toast.showSuccess(res.data.msg)
    } else {
        toast.showError(res.data.msg)
    }
}

async function deleteBackup(backup_dir: string) {
    const res = await deleteBackupReq(backup_dir)

    if (res.status === 200) {
        toast.showSuccess(res.data.msg)
        backups.value = backups.value.filter(backup => backup.name !== backup_dir)
    } else {
        toast.showError(res.data.msg)
    }
}
</script>
<style lang="scss">
.backup-restore {
    position: relative;

    .itemlist {
        display: grid;
        gap: $small;

        .item {
            display: grid;
            grid-template-columns: 1fr 100px;
            gap: 1rem;

            padding: 1rem;
            border: solid 1px $gray3;
            align-items: center;

            .texts {
                display: flex;
                flex-direction: column;
                gap: $small;
            }
        }

        .item .item__info {
            display: flex;
            justify-content: space-between;
        }

        .item .item__info .item__name {
            font-size: 0.5rem;
            color: $gray3;
            font-family: 'SF Mono';
        }

        .item__stats {
            display: flex;
            gap: $small;
            font-size: 0.8rem;
            color: $gray1;
        }
    }

    .restore-all {
        width: 100%;
        margin-top: 2rem;
    }

    .backupnow {
        position: absolute;
        right: -0.5rem;
        top: -2.75rem;
    }

    .separator {
        width: calc(100% + 0.5rem);
        margin-top: 1rem;
    }

    .helptext {
        font-size: small;
        color: $gray1;
        font-weight: 400;
        margin-top: -0.25rem;
    }

    .buttons {
        display: flex;
        gap: 1rem;
        align-items: center;

        svg {
            height: 1.2rem;
            cursor: pointer;
        }

        svg:hover {
            color: $red;
        }
    }
}
</style>
