import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import Header from "../components/Header";

export default function GroupsPage() {
  const { myGroups, createGroup, joinGroup, leaveGroup, getGroupMovies, setPage, user } = useApp();
  const [tab, setTab] = useState("list"); // list | create | join | detail
  const [detailGroup, setDetailGroup] = useState(null);

  const openDetail = (group) => {
    setDetailGroup(group);
    setTab("detail");
  };

  const back = () => { setDetailGroup(null); setTab("list"); };

  return (
    <div style={s.root}>
      <Header />
      <div style={s.main}>
        {tab !== "detail" && (
          <div style={s.topBar}>
            <div>
              <h1 style={s.heading}>Группы</h1>
              <p style={s.sub}>Смотрите фильмы вместе — создайте группу и получайте общие рекомендации</p>
            </div>
            <button style={s.backBtn} onClick={() => setPage("home")}>← На главную</button>
          </div>
        )}

        {tab === "list" && <ListView myGroups={myGroups} onOpenDetail={openDetail} setTab={setTab} leaveGroup={leaveGroup} />}
        {tab === "create" && <CreateForm onBack={back} createGroup={createGroup} onSuccess={(g) => openDetail(g)} />}
        {tab === "join"   && <JoinForm   onBack={back} joinGroup={joinGroup}     onSuccess={(g) => openDetail(g)} />}
        {tab === "detail" && detailGroup && (
          <DetailView group={detailGroup} onBack={back} getGroupMovies={getGroupMovies} user={user} leaveGroup={leaveGroup} setTab={setTab} setDetailGroup={setDetailGroup} myGroups={myGroups} />
        )}
      </div>
    </div>
  );
}

/* ─── LIST VIEW ─── */
function ListView({ myGroups, onOpenDetail, setTab, leaveGroup }) {
  return (
    <div>
      {/* Action cards */}
      <div style={s.actionRow}>
        <button style={s.actionCard} onClick={() => setTab("create")}>
          <span style={s.actionIcon}>➕</span>
          <span style={s.actionTitle}>Создать группу</span>
          <span style={s.actionDesc}>Получите код — поделитесь с друзьями</span>
        </button>
        <button style={s.actionCard} onClick={() => setTab("join")}>
          <span style={s.actionIcon}>🔗</span>
          <span style={s.actionTitle}>Войти по коду</span>
          <span style={s.actionDesc}>Введите 6-символьный код группы</span>
        </button>
      </div>

      {/* My groups */}
      <div style={s.sectionLabel}>
        Мои группы
        <span style={s.sectionCount}>{myGroups.length}</span>
      </div>

      {myGroups.length === 0 ? (
        <div style={s.empty}>
          <div style={s.emptyIcon}>👥</div>
          <h3 style={s.emptyTitle}>Вы пока не в группах</h3>
          <p style={s.emptyText}>Создайте группу или присоединитесь по коду,<br />чтобы получать общие рекомендации</p>
        </div>
      ) : (
        <div style={s.groupList}>
          {myGroups.map((g) => (
            <GroupCard key={g.id} group={g} onOpen={() => onOpenDetail(g)} onLeave={() => leaveGroup(g.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function GroupCard({ group, onOpen, onLeave }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      style={{ ...s.groupCard, ...(hover ? s.groupCardHover : {}) }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={s.groupCardLeft} onClick={onOpen}>
        <div style={s.groupAvatar}>{group.name[0].toUpperCase()}</div>
        <div>
          <div style={s.groupName}>{group.name}</div>
          <div style={s.groupMeta}>
            <span style={s.codeChip}>#{group.code}</span>
            <span style={s.memberCount}>👤 {group.members.length} участн.</span>
            <span style={s.createdAt}>создана {group.createdAt}</span>
          </div>
        </div>
      </div>
      <div style={s.groupCardRight}>
        <button style={s.openBtn} onClick={onOpen}>Открыть →</button>
        <button style={s.leaveBtn} onClick={(e) => { e.stopPropagation(); onLeave(); }}>Покинуть</button>
      </div>
    </div>
  );
}

/* ─── CREATE FORM ─── */
function CreateForm({ onBack, createGroup, onSuccess }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const result = createGroup(name);
    setLoading(false);
    if (!result.ok) { setError(result.error); return; }
    onSuccess(result.group);
  };

  return (
    <div style={s.formWrap}>
      <button style={s.breadcrumb} onClick={onBack}>← Назад к группам</button>
      <h2 style={s.formTitle}>Создать группу</h2>
      <p style={s.formSub}>Придумайте название. После создания вы получите уникальный код — поделитесь им с друзьями.</p>

      <div style={s.field}>
        <label style={s.label}>Название группы</label>
        <input
          style={s.input}
          placeholder="Например: «Кино по пятницам»"
          value={name}
          onChange={e => { setName(e.target.value); setError(""); }}
          autoFocus
        />
      </div>
      {error && <div style={s.errorBox}>{error}</div>}
      <button style={s.submitBtn} onClick={handle} disabled={loading}>
        {loading ? "Создаём..." : "Создать группу →"}
      </button>
    </div>
  );
}

/* ─── JOIN FORM ─── */
function JoinForm({ onBack, joinGroup, onSuccess }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const result = joinGroup(code);
    setLoading(false);
    if (!result.ok) { setError(result.error); return; }
    onSuccess(result.group);
  };

  return (
    <div style={s.formWrap}>
      <button style={s.breadcrumb} onClick={onBack}>← Назад к группам</button>
      <h2 style={s.formTitle}>Войти по коду</h2>
      <p style={s.formSub}>Введите 6-символьный код группы, который вам прислали.</p>

      <div style={s.hintBox}>
        <span style={s.hintIcon}>💡</span>
        <div>
          <strong style={{ color: "#c9a227" }}>Тестовые коды групп</strong>
          <div style={s.hintCodes}>
            <span style={s.codeChip}>DEMO01</span> — Киноклуб «Пятница» (2 участника)
            <br />
            <span style={s.codeChip}>SCIFI7</span> — Любители Sci-Fi (1 участник)
          </div>
        </div>
      </div>

      <div style={s.field}>
        <label style={s.label}>Код группы</label>
        <input
          style={{ ...s.input, textTransform: "uppercase", letterSpacing: "4px", fontSize: 20, fontWeight: 700 }}
          placeholder="XXXXXX"
          value={code}
          onChange={e => { setCode(e.target.value.toUpperCase().slice(0, 6)); setError(""); }}
          maxLength={6}
          autoFocus
        />
      </div>
      {error && <div style={s.errorBox}>{error}</div>}
      <button style={s.submitBtn} onClick={handle} disabled={loading || code.length < 4}>
        {loading ? "Подключаемся..." : "Войти в группу →"}
      </button>
    </div>
  );
}

/* ─── DETAIL VIEW ─── */
function DetailView({ group, onBack, getGroupMovies, user, leaveGroup, setTab, setDetailGroup, myGroups }) {
  const movies = getGroupMovies(group.id);
  const isOwner = group.createdBy === user.name;

  const handleLeave = () => {
    leaveGroup(group.id);
    onBack();
  };

  return (
    <div>
      <button style={s.breadcrumb} onClick={onBack}>← Все группы</button>

      {/* Group header */}
      <div style={s.detailHeader}>
        <div style={s.detailAvatar}>{group.name[0].toUpperCase()}</div>
        <div style={s.detailInfo}>
          <h2 style={s.detailTitle}>{group.name}</h2>
          <div style={s.detailMeta}>
            {isOwner && <span style={s.ownerBadge}>Создатель</span>}
            <span>Создана {group.createdAt}</span>
          </div>
        </div>
      </div>

      {/* Code share block */}
      <div style={s.shareBlock}>
        <div>
          <div style={s.shareLabel}>Код для приглашения</div>
          <div style={s.shareCode}>{group.code}</div>
          <div style={s.shareHint}>Поделитесь кодом с друзьями — они смогут войти через «Войти по коду»</div>
        </div>
        <button style={s.copyBtn} onClick={() => navigator.clipboard?.writeText(group.code)}>
          📋 Скопировать
        </button>
      </div>

      <div style={s.detailGrid}>
        {/* Members */}
        <div style={s.panel}>
          <div style={s.panelTitle}>Участники группы <span style={s.panelCount}>{group.members.length}</span></div>
          <div style={s.memberList}>
            {group.members.map((m) => (
              <div key={m.name} style={s.memberRow}>
                <div style={s.memberAvatar}>{m.displayName[0].toUpperCase()}</div>
                <div>
                  <div style={s.memberName}>
                    {m.displayName}
                    {m.name === group.createdBy && <span style={s.ownerMark}> 👑</span>}
                    {m.name === user.name && <span style={s.youMark}> (вы)</span>}
                  </div>
                  <div style={s.memberFavs}>❤️ {m.favorites?.length || 0} фильмов в избранном</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Group recommendations placeholder */}
        <div style={s.panel}>
          <div style={s.panelTitle}>
            Рекомендации группы
            <span style={s.panelCount}>{movies.length}</span>
          </div>

          {group.members.length < 2 ? (
            <div style={s.placeholderBlock}>
              <div style={s.placeholderIcon}>🎬</div>
              <div style={s.placeholderTitle}>Пригласите участников</div>
              <div style={s.placeholderText}>
                Рекомендации сформируются, когда в группе будет хотя бы 2 участника.
                Поделитесь кодом <strong style={{ color: "#c9a227" }}>{group.code}</strong> с другом.
              </div>
            </div>
          ) : (
            <div style={s.placeholderBlock}>
              <div style={s.placeholderIcon}>🚧</div>
              <div style={s.placeholderTitle}>Раздел в разработке</div>
              <div style={s.placeholderText}>
                Алгоритм нашёл <strong style={{ color: "#c9a227" }}>{movies.length} фильмов</strong>,
                которые понравятся всей группе. Полноценный список рекомендаций будет доступен
                в финальной версии системы.
              </div>
              <div style={s.moviePreviewRow}>
                {movies.slice(0, 4).map((m) => (
                  <div key={m.id} style={s.movieThumb}>
                    <img src={m.poster} alt={m.title} style={s.thumbImg}
                      onError={e => { e.target.style.display = "none"; }} />
                    <div style={s.thumbTitle}>{m.title}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <button style={s.leaveFullBtn} onClick={handleLeave}>
        Покинуть группу
      </button>
    </div>
  );
}

/* ─── STYLES ─── */
const s = {
  root: {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #0a0a0f 0%, #0f0e18 60%, #0d0d1c 100%)",
    fontFamily: "'DM Sans', sans-serif",
  },
  main: { maxWidth: 1000, margin: "0 auto", padding: "48px 40px" },

  topBar: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40, flexWrap: "wrap", gap: 16 },
  heading: { fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 700, color: "#fff", marginBottom: 8 },
  sub: { color: "rgba(255,255,255,0.4)", fontSize: 14 },
  backBtn: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "11px 20px", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, whiteSpace: "nowrap" },

  actionRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 40 },
  actionCard: {
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16, padding: "28px 24px", cursor: "pointer", textAlign: "left",
    display: "flex", flexDirection: "column", gap: 8, transition: "all 0.2s",
    fontFamily: "'DM Sans', sans-serif",
  },
  actionIcon: { fontSize: 28 },
  actionTitle: { color: "#fff", fontSize: 18, fontWeight: 700, fontFamily: "'Playfair Display', serif" },
  actionDesc: { color: "rgba(255,255,255,0.4)", fontSize: 13 },

  sectionLabel: { color: "rgba(255,255,255,0.35)", fontSize: 11, textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 },
  sectionCount: { background: "rgba(255,255,255,0.07)", borderRadius: 20, padding: "2px 10px", fontSize: 12, color: "rgba(255,255,255,0.5)" },

  empty: { display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 60, gap: 10 },
  emptyIcon: { fontSize: 56, marginBottom: 8 },
  emptyTitle: { fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#fff", fontWeight: 700 },
  emptyText: { color: "rgba(255,255,255,0.4)", textAlign: "center", lineHeight: 1.7, fontSize: 14 },

  groupList: { display: "flex", flexDirection: "column", gap: 12 },
  groupCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.2s", gap: 16 },
  groupCardHover: { borderColor: "rgba(201,162,39,0.25)", background: "rgba(201,162,39,0.04)" },
  groupCardLeft: { display: "flex", alignItems: "center", gap: 16, cursor: "pointer", flex: 1, minWidth: 0 },
  groupAvatar: { width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #3a2f6e, #5b45a8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#fff", flexShrink: 0 },
  groupName: { color: "#fff", fontSize: 16, fontWeight: 600, marginBottom: 6 },
  groupMeta: { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" },
  codeChip: { background: "rgba(201,162,39,0.12)", border: "1px solid rgba(201,162,39,0.25)", color: "#c9a227", borderRadius: 6, padding: "2px 10px", fontSize: 12, fontWeight: 700, letterSpacing: "1px", fontFamily: "monospace" },
  memberCount: { color: "rgba(255,255,255,0.4)", fontSize: 13 },
  createdAt: { color: "rgba(255,255,255,0.25)", fontSize: 12 },
  groupCardRight: { display: "flex", gap: 8, flexShrink: 0 },
  openBtn: { background: "rgba(201,162,39,0.12)", border: "1px solid rgba(201,162,39,0.25)", borderRadius: 8, padding: "8px 16px", color: "#c9a227", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 },
  leaveBtn: { background: "rgba(220,60,60,0.08)", border: "1px solid rgba(220,60,60,0.2)", borderRadius: 8, padding: "8px 16px", color: "rgba(255,100,100,0.7)", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 },

  formWrap: { maxWidth: 520 },
  breadcrumb: { background: "transparent", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif", padding: 0, marginBottom: 20, display: "block", transition: "color 0.2s" },
  formTitle: { fontFamily: "'Playfair Display', serif", fontSize: 32, color: "#fff", fontWeight: 700, marginBottom: 8 },
  formSub: { color: "rgba(255,255,255,0.4)", fontSize: 14, lineHeight: 1.7, marginBottom: 28 },
  field: { display: "flex", flexDirection: "column", gap: 7, marginBottom: 18 },
  label: { color: "rgba(255,255,255,0.4)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 500 },
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "13px 16px", color: "#fff", fontSize: 15, fontFamily: "'DM Sans', sans-serif", outline: "none" },
  errorBox: { background: "rgba(220,60,60,0.1)", border: "1px solid rgba(220,60,60,0.25)", borderRadius: 8, padding: "10px 14px", color: "#ff7070", fontSize: 13, marginBottom: 16 },
  submitBtn: { background: "linear-gradient(135deg, #c9a227, #e8c547)", border: "none", borderRadius: 12, padding: "14px 32px", color: "#0a0a0f", cursor: "pointer", fontSize: 15, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, transition: "opacity 0.2s" },
  hintBox: { display: "flex", gap: 14, background: "rgba(201,162,39,0.06)", border: "1px solid rgba(201,162,39,0.18)", borderRadius: 12, padding: "14px 18px", marginBottom: 24 },
  hintIcon: { fontSize: 20, flexShrink: 0 },
  hintCodes: { color: "rgba(255,255,255,0.45)", fontSize: 13, marginTop: 6, lineHeight: 2 },

  detailHeader: { display: "flex", alignItems: "center", gap: 20, marginBottom: 28 },
  detailAvatar: { width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #3a2f6e, #5b45a8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 700, color: "#fff", flexShrink: 0 },
  detailInfo: {},
  detailTitle: { fontFamily: "'Playfair Display', serif", fontSize: 30, color: "#fff", fontWeight: 700, marginBottom: 8 },
  detailMeta: { display: "flex", alignItems: "center", gap: 12, color: "rgba(255,255,255,0.35)", fontSize: 13 },
  ownerBadge: { background: "rgba(201,162,39,0.15)", border: "1px solid rgba(201,162,39,0.3)", color: "#c9a227", borderRadius: 6, padding: "2px 10px", fontSize: 12, fontWeight: 600 },

  shareBlock: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(201,162,39,0.06)", border: "1px solid rgba(201,162,39,0.2)", borderRadius: 14, padding: "20px 24px", marginBottom: 28, gap: 20, flexWrap: "wrap" },
  shareLabel: { color: "rgba(255,255,255,0.35)", fontSize: 11, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 },
  shareCode: { fontFamily: "monospace", fontSize: 32, fontWeight: 700, color: "#c9a227", letterSpacing: "6px", marginBottom: 8 },
  shareHint: { color: "rgba(255,255,255,0.35)", fontSize: 12 },
  copyBtn: { background: "rgba(201,162,39,0.12)", border: "1px solid rgba(201,162,39,0.3)", borderRadius: 10, padding: "12px 20px", color: "#c9a227", cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, whiteSpace: "nowrap" },

  detailGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 },
  panel: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 22 },
  panelTitle: { color: "rgba(255,255,255,0.5)", fontSize: 11, textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 },
  panelCount: { background: "rgba(255,255,255,0.07)", borderRadius: 20, padding: "2px 9px", fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" },

  memberList: { display: "flex", flexDirection: "column", gap: 14 },
  memberRow: { display: "flex", alignItems: "center", gap: 12 },
  memberAvatar: { width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #1e3a5f, #2d6a9f)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0 },
  memberName: { color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 2 },
  ownerMark: { color: "#c9a227" },
  youMark: { color: "rgba(255,255,255,0.35)", fontWeight: 400, fontSize: 12 },
  memberFavs: { color: "rgba(255,255,255,0.35)", fontSize: 12 },

  placeholderBlock: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "16px 0", gap: 10 },
  placeholderIcon: { fontSize: 40, marginBottom: 4 },
  placeholderTitle: { fontFamily: "'Playfair Display', serif", color: "#fff", fontSize: 17, fontWeight: 700 },
  placeholderText: { color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1.7 },

  moviePreviewRow: { display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap", justifyContent: "center" },
  movieThumb: { width: 72, display: "flex", flexDirection: "column", gap: 6 },
  thumbImg: { width: 72, height: 108, objectFit: "cover", borderRadius: 8 },
  thumbTitle: { color: "rgba(255,255,255,0.5)", fontSize: 10, textAlign: "center", lineHeight: 1.3 },

  leaveFullBtn: { background: "rgba(220,60,60,0.08)", border: "1px solid rgba(220,60,60,0.2)", borderRadius: 10, padding: "12px 24px", color: "rgba(255,100,100,0.7)", cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 },
};
