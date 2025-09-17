<template>
    <div class="race-card">
        <div class="race-main">
            <div class="race-title">
                <span class="race-name">{{ race.name }}</span>
                <span class="race-id">ID: {{ race.id }}</span>
            </div>
            <div class="race-status" :class="{ 'active': race.status === 'active' }">
                {{ raceStatusText }}
            </div>
        </div>
        <div class="race-details">
            <div class="detail-item">
                <span class="detail-label">创建时间:</span>
                <span class="detail-value">{{ formattedDate }}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">总投注:</span>
                <span class="detail-value">{{ race.addTotalAmount }}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">总抛注:</span>
                <span class="detail-value">{{ race.paoTotalAmount }}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">特码:</span>
                <span class="detail-value special-code">{{ race.specialCode || '未设置' }}</span>
            </div>
        </div>

        <div class="flat-codes-section" v-if="race.flatCodes && race.flatCodes.length > 0">
            <div class="section-title">平码列表</div>
            <div class="flat-codes-container">
                <span class="flat-code" v-for="code in race.flatCodes" :key="code">
                    {{ code }}
                </span>
            </div>
        </div>

        <div class="race-actions">
            <button class="action-btn view" @click="handleView">查看</button>
            <button class="action-btn edit" @click="handleEdit">编辑</button>
            <button class="action-btn delete" @click="handleDelete">删除</button>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    race: {
        type: Object,
        required: true,
        validator: (value) => {
            return (
                value.id &&
                value.name &&
                value.status &&
                value.createdAt &&
                value.addTotalAmount !== undefined
            );
        },
    },
});
const emit = defineEmits(['view', 'edit', 'delete']);
const raceStatusText = computed(() => {
    return props.race.status === 'active' ? '进行中' : '已结束';
});
const formattedDate = computed(() => {
    const date = new Date(props.race.createdAt);
    return date.toLocaleString();
});

const handleView = () => {
    emit('view', props.race.id);
};

const handleEdit = () => {
    emit('edit', props.race.id);
};

const handleDelete = () => {
    emit('delete', props.race.id);
};
</script>

<style scoped>
.race-card {
    border: 1px solid #eee;
    border-radius: 10px;
    padding: 16px;
    transition: all 0.3s ease;
}

.race-card:hover {
    border-color: #ddd;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.race-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.race-title {
    flex: 1;
}

.race-name {
    font-weight: 600;
    color: #333;
    font-size: 16px;
    margin-right: 10px;
}

.race-id {
    font-size: 12px;
    color: #888;
    background: #f5f5f5;
    padding: 2px 8px;
    border-radius: 4px;
}

.race-status {
    font-size: 12px;
    font-weight: 500;
    padding: 4px 10px;
    border-radius: 12px;
    background: #f0f0f0;
    color: #888;
}

.race-status.active {
    background: #e6f7ee;
    color: #28a745;
}

.race-details {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 10px;
    margin-bottom: 15px;
}

.detail-item {
    display: flex;
    align-items: center;
}

.detail-label {
    color: #888;
    font-size: 13px;
    margin-right: 8px;
    min-width: 60px;
}

.detail-value {
    font-size: 13px;
    color: #555;
}

.detail-value.special-code {
    font-weight: bold;
    color: #4f46e5;
}

.flat-codes-section {
    margin-bottom: 15px;
}

.section-title {
    font-size: 13px;
    color: #888;
    margin-bottom: 8px;
}

.flat-codes-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.flat-code {
    background: #f0f0f0;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 12px;
    color: #555;
}

.race-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
}

.action-btn {
    padding: 6px 12px;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.action-btn.view {
    background: #e0f2fe;
    color: #0ea5e9;
}

.action-btn.view:hover {
    background: #bae6fd;
}

.action-btn.edit {
    background: #e0e7ff;
    color: #4f46e5;
}

.action-btn.edit:hover {
    background: #c7d2fe;
}

.action-btn.delete {
    background: #fee2e2;
    color: #ef4444;
}

.action-btn.delete:hover {
    background: #fecaca;
}

@media (max-width: 768px) {
    .race-details {
        grid-template-columns: 1fr;
    }

    .race-actions {
        justify-content: flex-start;
    }
}
</style>