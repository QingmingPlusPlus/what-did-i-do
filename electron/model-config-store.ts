import { app } from "electron";
import { promises as fs } from "node:fs";
import path from "node:path";

export type ModelProviderId = "deepseek" | "opencodego";

export interface ModelProvider {
  id: ModelProviderId;
  name: string;
}

export interface ModelProviderView extends ModelProvider {
  apiKey: string;
  configured: boolean;
  updatedAt?: string;
}

export interface ModelConfigView {
  selectedProviderId: ModelProviderId;
  providers: ModelProviderView[];
}

export type ModelConfigStatus = "success" | "invalid-provider" | "error";

export interface ModelConfigResult {
  ok: boolean;
  status: ModelConfigStatus;
  config: ModelConfigView;
  message?: string;
}

interface SavedModelConfig {
  selectedProviderId: ModelProviderId;
  providerKeys: Partial<Record<ModelProviderId, string>>;
  providerUpdatedAt: Partial<Record<ModelProviderId, string>>;
}

const storageFileName = "model-config.json";

export const supportedModelProviders: ModelProvider[] = [
  { id: "deepseek", name: "DeepSeek" },
  { id: "opencodego", name: "OpenCodeGo" },
];

const defaultProviderId = supportedModelProviders[0].id;

function modelConfigFilePath() {
  return path.join(app.getPath("userData"), storageFileName);
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isModelProviderId(value: unknown): value is ModelProviderId {
  return supportedModelProviders.some((provider) => provider.id === value);
}

function parseProviderMap(value: unknown) {
  const result: Partial<Record<ModelProviderId, string>> = {};

  if (!isObject(value)) {
    return result;
  }

  for (const provider of supportedModelProviders) {
    const item = value[provider.id];
    if (typeof item === "string") {
      result[provider.id] = item;
    }
  }

  return result;
}

function createEmptyModelConfig(): SavedModelConfig {
  return {
    selectedProviderId: defaultProviderId,
    providerKeys: {},
    providerUpdatedAt: {},
  };
}

function parseSavedModelConfig(value: unknown): SavedModelConfig {
  if (!isObject(value)) {
    return createEmptyModelConfig();
  }

  return {
    selectedProviderId: isModelProviderId(value.selectedProviderId)
      ? value.selectedProviderId
      : defaultProviderId,
    providerKeys: parseProviderMap(value.providerKeys),
    providerUpdatedAt: parseProviderMap(value.providerUpdatedAt),
  };
}

async function readSavedModelConfig() {
  try {
    const raw = await fs.readFile(modelConfigFilePath(), "utf8");
    return parseSavedModelConfig(JSON.parse(raw));
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      return createEmptyModelConfig();
    }

    console.error("Failed to read model config store.", error);
    throw error;
  }
}

async function writeSavedModelConfig(config: SavedModelConfig) {
  const filePath = modelConfigFilePath();
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(config, null, 2)}\n`, {
    encoding: "utf8",
    mode: 0o600,
  });
}

function toModelConfigView(config: SavedModelConfig): ModelConfigView {
  return {
    selectedProviderId: config.selectedProviderId,
    providers: supportedModelProviders.map((provider) => {
      const apiKey = config.providerKeys[provider.id] ?? "";

      return {
        ...provider,
        apiKey,
        configured: apiKey.length > 0,
        updatedAt: config.providerUpdatedAt[provider.id],
      };
    }),
  };
}

function success(config: ModelConfigView, message?: string): ModelConfigResult {
  return { ok: true, status: "success", config, message };
}

function failure(
  config: ModelConfigView,
  status: Exclude<ModelConfigStatus, "success">,
  message: string,
): ModelConfigResult {
  return { ok: false, status, config, message };
}

export async function getModelConfig(): Promise<ModelConfigResult> {
  try {
    return success(toModelConfigView(await readSavedModelConfig()));
  } catch (error) {
    console.error("Failed to get model config.", error);
    return failure(toModelConfigView(createEmptyModelConfig()), "error", "读取模型供应商配置失败");
  }
}

export async function selectModelProvider(providerId: string): Promise<ModelConfigResult> {
  try {
    const currentConfig = await readSavedModelConfig();

    if (!isModelProviderId(providerId)) {
      return failure(toModelConfigView(currentConfig), "invalid-provider", "暂不支持该模型供应商");
    }

    const nextConfig: SavedModelConfig = {
      ...currentConfig,
      selectedProviderId: providerId,
    };
    await writeSavedModelConfig(nextConfig);

    return success(toModelConfigView(nextConfig), "模型供应商已切换");
  } catch (error) {
    console.error("Failed to select model provider.", error);
    return failure(toModelConfigView(createEmptyModelConfig()), "error", "切换模型供应商失败");
  }
}

export async function updateModelProviderKey(
  providerId: string,
  apiKey: string,
): Promise<ModelConfigResult> {
  try {
    const currentConfig = await readSavedModelConfig();

    if (!isModelProviderId(providerId)) {
      return failure(toModelConfigView(currentConfig), "invalid-provider", "暂不支持该模型供应商");
    }

    const normalizedApiKey = apiKey.trim();
    const nextConfig: SavedModelConfig = {
      selectedProviderId: providerId,
      providerKeys: {
        ...currentConfig.providerKeys,
        [providerId]: normalizedApiKey,
      },
      providerUpdatedAt: {
        ...currentConfig.providerUpdatedAt,
        [providerId]: new Date().toISOString(),
      },
    };
    await writeSavedModelConfig(nextConfig);

    return success(toModelConfigView(nextConfig), "模型供应商配置已保存");
  } catch (error) {
    console.error("Failed to update model provider key.", error);
    return failure(toModelConfigView(createEmptyModelConfig()), "error", "保存模型供应商配置失败");
  }
}
